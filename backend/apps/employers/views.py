from django.db.models import Q
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from apps.applications.models import Application
from apps.applications.serializers import ApplicationSerializer
from apps.candidates.models import CandidateProfile
from apps.candidates.serializers import CandidateProfileSerializer, CandidateSearchSerializer
from apps.common.permissions import IsEmployer
from apps.jobs.models import Job
from apps.jobs.serializers import JobSerializer
from apps.notifications.models import Notification
from .models import EmployerProfile
from .serializers import EmployerProfileSerializer


class EmployerProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsEmployer]
    serializer_class = EmployerProfileSerializer
    def get_object(self): return EmployerProfile.objects.get(user=self.request.user)


class EmployerLogoView(EmployerProfileView):
    def post(self, request, *args, **kwargs): return self.partial_update(request, *args, **kwargs)


class EmployerJobsView(generics.ListCreateAPIView):
    permission_classes = [IsEmployer]
    serializer_class = JobSerializer
    def get_queryset(self): return Job.objects.filter(employer__user=self.request.user).select_related("employer")
    def perform_create(self, serializer): serializer.save(employer=self.request.user.employer_profile, status=Job.Status.PENDING)


class EmployerJobDetailView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsEmployer]
    serializer_class = JobSerializer
    def get_queryset(self): return Job.objects.filter(employer__user=self.request.user).select_related("employer")
    def delete(self, request, *args, **kwargs):
        job = self.get_object(); job.status = Job.Status.CLOSED; job.save(update_fields=["status", "updated_at"])
        return Response(status=status.HTTP_204_NO_CONTENT)


class EmployerJobCloseView(APIView):
    permission_classes = [IsEmployer]
    def patch(self, request, pk):
        job = Job.objects.filter(pk=pk, employer__user=request.user).first()
        if not job: return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        job.status = Job.Status.CLOSED; job.save(update_fields=["status", "updated_at"])
        return Response(JobSerializer(job).data)


class EmployerApplicationsView(generics.ListAPIView):
    permission_classes = [IsEmployer]; serializer_class = ApplicationSerializer
    def get_queryset(self): return Application.objects.filter(job__employer__user=self.request.user).select_related("job__employer", "candidate__user")


class EmployerApplicationDetailView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsEmployer]; serializer_class = ApplicationSerializer
    def get_queryset(self): return Application.objects.filter(job__employer__user=self.request.user).select_related("job__employer", "candidate__user")
    def perform_update(self, serializer):
        application = serializer.save()
        Notification.objects.create(user=application.candidate.user, title="Application update", message=f"Your application for {application.job.title} is now {application.status}.", type="application_status", related_type="application", related_id=application.id)


class EmployerApplicationStatusView(EmployerApplicationDetailView):
    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)


class EmployerCandidatesView(generics.ListAPIView):
    permission_classes = [IsEmployer]; serializer_class = CandidateSearchSerializer
    def get_queryset(self):
        qs = CandidateProfile.objects.select_related("user")
        p = self.request.query_params
        if p.get("search"): qs = qs.filter(Q(user__name__icontains=p["search"]) | Q(skills__icontains=p["search"]))
        for key, lookup in (("location", "location__icontains"), ("skills", "skills__icontains"), ("license_category", "license_category__iexact")):
            if p.get(key): qs = qs.filter(**{lookup: p[key]})
        if p.get("experience"): qs = qs.filter(experience_years__gte=p["experience"])
        return qs


class EmployerCandidateDetailView(generics.RetrieveAPIView):
    permission_classes = [IsEmployer]; serializer_class = CandidateProfileSerializer
    queryset = CandidateProfile.objects.select_related("user")


class EmployerCandidateContactView(APIView):
    permission_classes = [IsEmployer]
    def post(self, request, pk):
        candidate = CandidateProfile.objects.filter(pk=pk).select_related("user").first()
        if not candidate: return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response({"name": candidate.user.name, "email": candidate.user.email, "phone": candidate.user.phone})
