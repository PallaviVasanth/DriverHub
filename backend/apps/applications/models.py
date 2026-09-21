from django.db import models
from apps.candidates.models import CandidateProfile
from apps.jobs.models import Job


class Application(models.Model):
    class Status(models.TextChoices):
        APPLIED = "applied", "Applied"
        SHORTLISTED = "shortlisted", "Shortlisted"
        REJECTED = "rejected", "Rejected"
        HIRED = "hired", "Hired"

    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name="applications")
    candidate = models.ForeignKey(CandidateProfile, on_delete=models.CASCADE, related_name="applications")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.APPLIED, db_index=True)
    cover_message = models.TextField(blank=True)
    resume_snapshot = models.FileField(upload_to="application_resumes/", blank=True)
    applied_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("-applied_at",)
        constraints = [models.UniqueConstraint(fields=["job", "candidate"], name="unique_candidate_job_application")]
        indexes = [models.Index(fields=["job", "status"]), models.Index(fields=["candidate", "status"])]
