from decimal import Decimal

from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from apps.applications.models import Application
from apps.candidates.models import CandidateProfile
from apps.employers.models import EmployerProfile
from apps.jobs.models import Job

User = get_user_model()


class AdminManagementTests(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_superuser(email="admin-phase5@test", name="Admin", password="Admin123!", role="admin")
        self.candidate_user = User.objects.create_user(email="candidate-admin@test", name="Candidate Admin", role="candidate", password="Candidate123!")
        self.candidate = CandidateProfile.objects.create(user=self.candidate_user, location="Bengaluru")
        self.employer_user = User.objects.create_user(email="employer-admin@test", name="Employer Admin", role="employer", password="Employer123!")
        self.employer = EmployerProfile.objects.create(user=self.employer_user, company_name="Admin Fleet")
        self.job = Job.objects.create(employer=self.employer, title="Admin Driver", description="Driver", driver_category="LMV", experience_required=1, location="Bengaluru", salary_min=Decimal("10000"), salary_max=Decimal("20000"), working_hours="Day", status=Job.Status.PENDING)
        self.application = Application.objects.create(job=self.job, candidate=self.candidate)

    def test_non_admin_cannot_access_admin_dashboard_or_management(self):
        self.client.force_authenticate(self.candidate_user)
        self.assertEqual(self.client.get("/api/admin/dashboard/").status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(self.client.get("/api/admin/candidates/").status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_dashboard_and_lists(self):
        self.client.force_authenticate(self.admin)
        dashboard = self.client.get("/api/admin/dashboard/")
        self.assertEqual(dashboard.status_code, status.HTTP_200_OK)
        self.assertEqual(dashboard.data["total_candidates"], 1)
        self.assertEqual(dashboard.data["total_employers"], 1)
        self.assertEqual(dashboard.data["total_jobs"], 1)
        self.assertEqual(dashboard.data["total_applications"], 1)
        self.assertEqual(dashboard.data["pending_jobs"], 1)
        self.assertEqual(self.client.get("/api/admin/candidates/").data["count"], 1)
        self.assertEqual(self.client.get("/api/admin/employers/").data["count"], 1)
        self.assertEqual(self.client.get("/api/admin/jobs/").data["count"], 1)
        self.assertEqual(self.client.get("/api/admin/applications/").data["count"], 1)

    def test_admin_can_block_users_and_approve_jobs(self):
        self.client.force_authenticate(self.admin)
        blocked_candidate = self.client.patch(f"/api/admin/candidates/{self.candidate.id}/", {"is_active": False}, format="json")
        self.assertEqual(blocked_candidate.status_code, status.HTTP_200_OK)
        self.assertFalse(User.objects.get(id=self.candidate_user.id).is_active)
        blocked_employer = self.client.patch(f"/api/admin/employers/{self.employer.id}/", {"is_active": False}, format="json")
        self.assertEqual(blocked_employer.status_code, status.HTTP_200_OK)
        approved_job = self.client.patch(f"/api/admin/jobs/{self.job.id}/", {"status": "approved"}, format="json")
        self.assertEqual(approved_job.status_code, status.HTTP_200_OK)
        self.assertEqual(approved_job.data["status"], "approved")

    def test_admin_can_update_application_status(self):
        self.client.force_authenticate(self.admin)
        response = self.client.patch(f"/api/admin/applications/{self.application.id}/", {"status": "hired"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "hired")
