from django.db import IntegrityError
from django.db.models import Q
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from apps.applications.models import Application
from apps.common.permissions import IsCandidate
from apps.notifications.models import Notification
from .models import Job
from .serializers import JobSerializer


class JobListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = JobSerializer

    def get_queryset(self):
        qs = Job.objects.filter(status=Job.Status.APPROVED).select_related("employer")
        p = self.request.query_params
        if p.get("search"):
            qs = qs.filter(Q(title__icontains=p["search"]) | Q(description__icontains=p["search"]))
        for key, lookup in (("location", "location__icontains"), ("category", "driver_category__iexact")):
            if p.get(key): qs = qs.filter(**{lookup: p[key]})
        if p.get("min_salary"): qs = qs.filter(salary_max__gte=p["min_salary"])
        return qs


class JobDetailView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    serializer_class = JobSerializer
    queryset = Job.objects.filter(status=Job.Status.APPROVED).select_related("employer")


class ApplyToJobView(APIView):
    permission_classes = [IsCandidate]

    def post(self, request, pk):
        job = Job.objects.filter(pk=pk, status=Job.Status.APPROVED).first()
        if not job: return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        if Application.objects.filter(job=job, candidate=request.user.candidate_profile).exists():
            return Response({"error": {"code": "DUPLICATE_APPLICATION", "message": "You have already applied to this job.", "details": {}}}, status=status.HTTP_409_CONFLICT)
        try:
            application = Application.objects.create(job=job, candidate=request.user.candidate_profile, cover_message=request.data.get("cover_message", ""))
        except IntegrityError:
            return Response({"error": {"code": "DUPLICATE_APPLICATION", "message": "You have already applied to this job.", "details": {}}}, status=status.HTTP_409_CONFLICT)
        Notification.objects.create(user=job.employer.user, title="New application", message=f"{request.user.name} applied for {job.title}.", type="application", related_type="application", related_id=application.id)
        return Response({"id": application.id, "status": application.status}, status=status.HTTP_201_CREATED)
