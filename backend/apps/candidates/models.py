from django.conf import settings
from django.db import models


class CandidateProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="candidate_profile")
    location = models.CharField(max_length=120, blank=True, db_index=True)
    experience_years = models.PositiveSmallIntegerField(default=0, db_index=True)
    skills = models.TextField(blank=True)
    license_category = models.CharField(max_length=50, blank=True, db_index=True)
    bio = models.TextField(blank=True)
    availability = models.CharField(max_length=100, blank=True)
    resume = models.FileField(upload_to="resumes/", blank=True)
    profile_photo = models.ImageField(upload_to="candidate_photos/", blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("-updated_at",)
