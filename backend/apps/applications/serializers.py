from rest_framework import serializers
from .models import Application


class ApplicationSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source="job.title", read_only=True)
    company_name = serializers.CharField(source="job.employer.company_name", read_only=True)
    location = serializers.CharField(source="job.location", read_only=True)
    candidate_name = serializers.CharField(source="candidate.user.name", read_only=True)

    class Meta:
        model = Application
        fields = ("id", "job", "job_title", "company_name", "location", "candidate", "candidate_name", "status", "cover_message", "resume_snapshot", "applied_at", "updated_at")
        read_only_fields = ("id", "job", "candidate", "candidate_name", "resume_snapshot", "applied_at", "updated_at")
