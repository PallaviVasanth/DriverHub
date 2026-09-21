from django.db import models
from apps.employers.models import EmployerProfile


class Job(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        APPROVED = "approved", "Approved"
        REJECTED = "rejected", "Rejected"
        CLOSED = "closed", "Closed"

    employer = models.ForeignKey(EmployerProfile, on_delete=models.CASCADE, related_name="jobs")
    title = models.CharField(max_length=180, db_index=True)
    description = models.TextField()
    driver_category = models.CharField(max_length=50, db_index=True)
    experience_required = models.PositiveSmallIntegerField(default=0)
    location = models.CharField(max_length=120, db_index=True)
    salary_min = models.DecimalField(max_digits=12, decimal_places=2)
    salary_max = models.DecimalField(max_digits=12, decimal_places=2)
    working_hours = models.CharField(max_length=120)
    required_documents = models.JSONField(default=list, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("-created_at",)
        indexes = [models.Index(fields=["status", "location"]), models.Index(fields=["status", "driver_category"])]
