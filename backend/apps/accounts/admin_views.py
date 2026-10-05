from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.applications.models import Application
from apps.candidates.models import CandidateProfile
from apps.common.permissions import IsAdmin
from apps.employers.models import EmployerProfile
from apps.jobs.models import Job
from .admin_serializers import AdminApplicationSerializer, AdminCandidateSerializer, AdminEmployerSerializer, AdminJobSerializer, AdminUserSerializer

User = get_user_model()


class AdminBaseView(APIView):
    permission_classes = [IsAdmin]


class AdminDashboardView(AdminBaseView):
    def get(self, request):
        return Response({"total_candidates": User.objects.filter(role=User.Role.CANDIDATE).count(), "total_employers": User.objects.filter(role=User.Role.EMPLOYER).count(), "total_jobs": Job.objects.count(), "total_applications": Application.objects.count(), "pending_jobs": Job.objects.filter(status=Job.Status.PENDING).count()})


class AdminCandidateListView(AdminBaseView):
    def get(self, request):
        profiles = CandidateProfile.objects.select_related("user").order_by("id")
        return Response({"count": profiles.count(), "results": AdminCandidateSerializer(profiles, many=True).data})


class AdminCandidateDetailView(AdminBaseView):
    def get(self, request, candidate_id):
        return Response(AdminCandidateSerializer(get_object_or_404(CandidateProfile.objects.select_related("user"), id=candidate_id)).data)

    def patch(self, request, candidate_id):
        profile = get_object_or_404(CandidateProfile.objects.select_related("user"), id=candidate_id)
        active = request.data.get("is_active")
        if active is None:
            return Response({"error": {"code": "VALIDATION_ERROR", "message": "is_active is required.", "details": {}}}, status=status.HTTP_400_BAD_REQUEST)
        profile.user.is_active = bool(active)
        profile.user.save(update_fields=["is_active", "updated_at"])
        return Response(AdminCandidateSerializer(profile).data)


class AdminEmployerListView(AdminBaseView):
    def get(self, request):
        profiles = EmployerProfile.objects.select_related("user").order_by("id")
        return Response({"count": profiles.count(), "results": AdminEmployerSerializer(profiles, many=True).data})


class AdminEmployerDetailView(AdminBaseView):
    def get(self, request, employer_id):
        return Response(AdminEmployerSerializer(get_object_or_404(EmployerProfile.objects.select_related("user"), id=employer_id)).data)

    def patch(self, request, employer_id):
        profile = get_object_or_404(EmployerProfile.objects.select_related("user"), id=employer_id)
        active = request.data.get("is_active")
        if active is None:
            return Response({"error": {"code": "VALIDATION_ERROR", "message": "is_active is required.", "details": {}}}, status=status.HTTP_400_BAD_REQUEST)
        profile.user.is_active = bool(active)
        profile.user.save(update_fields=["is_active", "updated_at"])
        return Response(AdminEmployerSerializer(profile).data)


class AdminJobListView(AdminBaseView):
    def get(self, request):
        jobs = Job.objects.select_related("employer").order_by("id")
        return Response({"count": jobs.count(), "results": AdminJobSerializer(jobs, many=True).data})


class AdminJobDetailView(AdminBaseView):
    def get(self, request, job_id):
        return Response(AdminJobSerializer(get_object_or_404(Job.objects.select_related("employer"), id=job_id)).data)

    def patch(self, request, job_id):
        job = get_object_or_404(Job, id=job_id)
        serializer = AdminJobSerializer(job, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(AdminJobSerializer(job).data)


class AdminApplicationListView(AdminBaseView):
    def get(self, request):
        applications = Application.objects.select_related("job", "candidate__user").order_by("id")
        return Response({"count": applications.count(), "results": AdminApplicationSerializer(applications, many=True).data})


class AdminApplicationDetailView(AdminBaseView):
    def get(self, request, application_id):
        application = get_object_or_404(Application.objects.select_related("job", "candidate__user"), id=application_id)
        return Response(AdminApplicationSerializer(application).data)

    def patch(self, request, application_id):
        application = get_object_or_404(Application, id=application_id)
        status_value = request.data.get("status")
        allowed = {choice[0] for choice in Application.Status.choices}
        if status_value not in allowed:
            return Response({"error": {"code": "VALIDATION_ERROR", "message": "Invalid application status.", "details": {}}}, status=status.HTTP_400_BAD_REQUEST)
        application.status = status_value
        application.save(update_fields=["status", "updated_at"])
        return Response(AdminApplicationSerializer(application).data)
