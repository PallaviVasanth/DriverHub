from rest_framework import serializers

from apps.applications.models import Application
from apps.candidates.models import CandidateProfile
from apps.employers.models import EmployerProfile
from apps.jobs.models import Job
from .models import User


class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "name", "email", "role", "phone", "is_active", "created_at")
        read_only_fields = ("id", "name", "email", "role", "phone", "created_at")


class AdminCandidateSerializer(serializers.ModelSerializer):
    user = AdminUserSerializer(read_only=True)

    class Meta:
        model = CandidateProfile
        fields = ("id", "user", "location", "experience_years", "skills", "license_category", "bio", "created_at", "updated_at")
        read_only_fields = ("id", "user", "created_at", "updated_at")


class AdminEmployerSerializer(serializers.ModelSerializer):
    user = AdminUserSerializer(read_only=True)

    class Meta:
        model = EmployerProfile
        fields = ("id", "user", "company_name", "company_description", "location", "phone", "website", "created_at", "updated_at")
        read_only_fields = ("id", "user", "created_at", "updated_at")


class AdminJobSerializer(serializers.ModelSerializer):
    employer_name = serializers.CharField(source="employer.company_name", read_only=True)

    class Meta:
        model = Job
        fields = ("id", "employer", "employer_name", "title", "description", "driver_category", "experience_required", "location", "salary_min", "salary_max", "working_hours", "required_documents", "status", "created_at", "updated_at")
        read_only_fields = ("id", "employer", "employer_name", "created_at", "updated_at")


class AdminApplicationSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source="job.title", read_only=True)
    candidate_name = serializers.CharField(source="candidate.user.name", read_only=True)

    class Meta:
        model = Application
        fields = ("id", "job", "job_title", "candidate", "candidate_name", "status", "cover_message", "applied_at", "updated_at")
        read_only_fields = ("id", "job", "job_title", "candidate", "candidate_name", "cover_message", "applied_at", "updated_at")
