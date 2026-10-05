from rest_framework import serializers
from apps.accounts.serializers import UserSerializer
from .models import CandidateProfile


class CandidateProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = CandidateProfile
        fields = ("id", "user", "location", "experience_years", "skills", "license_category", "bio", "availability", "resume", "profile_photo", "created_at", "updated_at")
        read_only_fields = ("id", "user", "created_at", "updated_at")


class CandidateSearchSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="user.name", read_only=True)

    class Meta:
        model = CandidateProfile
        fields = ("id", "name", "location", "experience_years", "skills", "license_category", "bio", "availability")
