from decimal import Decimal
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase
from apps.applications.models import Application
from apps.candidates.models import CandidateProfile
from apps.employers.models import EmployerProfile
from .models import Job

User = get_user_model()


class MarketplaceApiTests(APITestCase):
    def setUp(self):
        self.candidate_user = User.objects.create_user(email="driver@test.local", name="Driver", role="candidate", password="Candidate123!")
        self.candidate = CandidateProfile.objects.create(user=self.candidate_user, location="Pune", experience_years=4, skills="GPS, safety", license_category="LMV")
        self.employer_user = User.objects.create_user(email="fleet@test.local", name="Fleet", role="employer", password="Employer123!")
        self.employer = EmployerProfile.objects.create(user=self.employer_user, company_name="Fleet Co", location="Pune")
        self.job = Job.objects.create(employer=self.employer, title="City Driver", description="Safe driving", driver_category="LMV", experience_required=2, location="Pune", salary_min=Decimal("20000"), salary_max=Decimal("30000"), working_hours="Day", status=Job.Status.APPROVED)

    def test_candidate_profile_and_job_filtering(self):
        self.client.force_authenticate(self.candidate_user)
        self.assertEqual(self.client.patch("/api/candidate/profile/", {"bio": "Available now"}, format="json").status_code, status.HTTP_200_OK)
        response = self.client.get("/api/jobs/?location=Pune&category=LMV&min_salary=25000")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)

    def test_application_duplicate_rejected_and_employer_can_manage(self):
        self.client.force_authenticate(self.candidate_user)
        self.assertEqual(self.client.post(f"/api/jobs/{self.job.id}/apply/", {"cover_message": "Interested"}, format="json").status_code, status.HTTP_201_CREATED)
        self.assertEqual(self.client.post(f"/api/jobs/{self.job.id}/apply/", {}, format="json").status_code, status.HTTP_409_CONFLICT)
        application = Application.objects.get()
        self.client.force_authenticate(self.employer_user)
        self.assertEqual(self.client.get("/api/employer/applications/").data["count"], 1)
        self.assertEqual(self.client.patch(f"/api/employer/applications/{application.id}/", {"status": "shortlisted"}, format="json").status_code, status.HTTP_200_OK)
        self.assertEqual(self.client.get("/api/employer/candidates/?skills=GPS").data["count"], 1)

    def test_role_separation_and_candidate_notifications(self):
        self.client.force_authenticate(self.candidate_user)
        self.assertEqual(self.client.get("/api/employer/jobs/").status_code, status.HTTP_403_FORBIDDEN)
        self.client.post(f"/api/jobs/{self.job.id}/apply/", {}, format="json")
        self.client.force_authenticate(self.employer_user)
        application = Application.objects.get()
        self.client.patch(f"/api/employer/applications/{application.id}/", {"status": "hired"}, format="json")
        self.client.force_authenticate(self.candidate_user)
        response = self.client.get("/api/candidate/notifications/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
