from django.urls import path
from .views import EmployerApplicationDetailView, EmployerApplicationStatusView, EmployerApplicationsView, EmployerCandidateContactView, EmployerCandidateDetailView, EmployerCandidatesView, EmployerJobCloseView, EmployerJobDetailView, EmployerJobsView, EmployerLogoView, EmployerProfileView

urlpatterns = [
    path("profile/", EmployerProfileView.as_view()), path("profile/logo/", EmployerLogoView.as_view()),
    path("jobs/", EmployerJobsView.as_view()), path("jobs/<int:pk>/", EmployerJobDetailView.as_view()), path("jobs/<int:pk>/close/", EmployerJobCloseView.as_view()),
    path("applications/", EmployerApplicationsView.as_view()), path("applications/<int:pk>/", EmployerApplicationDetailView.as_view()), path("applications/<int:pk>/status/", EmployerApplicationStatusView.as_view()),
    path("candidates/", EmployerCandidatesView.as_view()), path("candidates/<int:pk>/", EmployerCandidateDetailView.as_view()), path("candidates/<int:pk>/contact/", EmployerCandidateContactView.as_view()),
]
