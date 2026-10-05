from rest_framework import serializers
from apps.accounts.serializers import UserSerializer
from .models import EmployerProfile


class EmployerProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = EmployerProfile
        fields = ("id", "user", "company_name", "company_description", "location", "phone", "website", "company_logo", "created_at", "updated_at")
        read_only_fields = ("id", "user", "created_at", "updated_at")
