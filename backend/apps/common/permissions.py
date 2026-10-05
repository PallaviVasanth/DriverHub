from rest_framework.permissions import BasePermission


class IsRole(BasePermission):
    required_role = None

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == self.required_role)


class IsCandidate(IsRole):
    required_role = "candidate"


class IsEmployer(IsRole):
    required_role = "employer"


class IsAdmin(IsRole):
    required_role = "admin"
