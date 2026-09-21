from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from candidates.models import CandidateProfile
from employers.models import EmployerProfile

User = get_user_model()


class AuthenticationTests(APITestCase):
    def test_candidate_registration_returns_tokens_and_profile(self):
        response = self.client.post("/api/auth/register/", {
            "name": "Candidate One", "email": "candidate@example.com",
            "password": "CandidatePass123!", "phone": "0000000001", "role": "candidate",
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["user"]["role"], "candidate")
        self.assertIn("access", response.data["tokens"])
        self.assertTrue(CandidateProfile.objects.filter(user__email="candidate@example.com").exists())
        self.assertTrue(User.objects.get(email="candidate@example.com").check_password("CandidatePass123!"))

    def test_employer_registration_returns_tokens_and_profile(self):
        response = self.client.post("/api/auth/register/", {
            "name": "Employer One", "email": "employer@example.com",
            "password": "EmployerPass123!", "phone": "0000000002", "role": "employer",
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["user"]["role"], "employer")
        self.assertTrue(EmployerProfile.objects.filter(user__email="employer@example.com").exists())

    def test_public_admin_registration_is_rejected(self):
        response = self.client.post("/api/auth/register/", {
            "name": "Unsafe Admin", "email": "admin@example.com",
            "password": "AdminPass123!", "role": "admin",
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_and_me_with_jwt(self):
        User.objects.create_user(email="login@example.com", name="Login User", role="candidate", password="LoginPass123!")
        response = self.client.post("/api/auth/login/", {"email": "login@example.com", "password": "LoginPass123!"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {response.data['access']}")
        me = self.client.get("/api/auth/me/")
        self.assertEqual(me.status_code, status.HTTP_200_OK)
        self.assertEqual(me.data["email"], "login@example.com")

    def test_invalid_login_is_rejected(self):
        User.objects.create_user(email="invalid@example.com", name="Invalid User", role="candidate", password="CorrectPass123!")
        response = self.client.post("/api/auth/login/", {"email": "invalid@example.com", "password": "WrongPass123!"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_protected_me_requires_authentication(self):
        response = self.client.get("/api/auth/me/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_role_authorization_is_enforced_server_side(self):
        user = User.objects.create_user(email="role@example.com", name="Role User", role="candidate", password="RolePass123!")
        response = self.client.post("/api/auth/login/", {"email": "role@example.com", "password": "RolePass123!"}, format="json")
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {response.data['access']}")
        self.assertEqual(self.client.get("/api/auth/role-check/candidate/").status_code, status.HTTP_200_OK)
        self.assertEqual(self.client.get("/api/auth/role-check/employer/").status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(self.client.get("/api/auth/role-check/admin/").status_code, status.HTTP_403_FORBIDDEN)
