from rest_framework import serializers
from .models import Job


class JobSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source="employer.company_name", read_only=True)
    company = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = ("id", "employer", "company_name", "company", "title", "description", "driver_category", "experience_required", "location", "salary_min", "salary_max", "working_hours", "required_documents", "status", "created_at", "updated_at")
        read_only_fields = ("id", "employer", "company_name", "company", "created_at", "updated_at")

    def get_company(self, obj):
        return {"name": obj.employer.company_name, "location": obj.employer.location}
