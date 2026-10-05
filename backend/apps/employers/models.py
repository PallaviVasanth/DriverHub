from django.conf import settings
from django.db import models


class EmployerProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="employer_profile")
    company_name = models.CharField(max_length=180, blank=True, db_index=True)
    company_description = models.TextField(blank=True)
    location = models.CharField(max_length=120, blank=True, db_index=True)
    phone = models.CharField(max_length=30, blank=True)
    website = models.URLField(blank=True)
    company_logo = models.ImageField(upload_to="company_logos/", blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("company_name",)
