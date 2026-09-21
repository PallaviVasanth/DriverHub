from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import LoginView, MeView, RegisterView, RoleCheckView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="auth-register"),
    path("login/", LoginView.as_view(), name="auth-login"),
    path("me/", MeView.as_view(), name="auth-me"),
    path("token/refresh/", TokenRefreshView.as_view(), name="auth-token-refresh"),
    path("role-check/<str:role>/", RoleCheckView.as_view(), name="auth-role-check"),
]
