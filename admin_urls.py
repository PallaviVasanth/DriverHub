from django.urls import path
from .admin_views import AdminApplicationDetailView, AdminApplicationListView, AdminCandidateDetailView, AdminCandidateListView, AdminDashboardView, AdminEmployerDetailView, AdminEmployerListView, AdminJobDetailView, AdminJobListView

urlpatterns = [
    path("dashboard/", AdminDashboardView.as_view(), name="admin-dashboard"),
    path("candidates/", AdminCandidateListView.as_view(), name="admin-candidates"),
    path("candidates/<int:candidate_id>/", AdminCandidateDetailView.as_view(), name="admin-candidate-detail"),
    path("employers/", AdminEmployerListView.as_view(), name="admin-employers"),
    path("employers/<int:employer_id>/", AdminEmployerDetailView.as_view(), name="admin-employer-detail"),
    path("jobs/", AdminJobListView.as_view(), name="admin-jobs"),
    path("jobs/<int:job_id>/", AdminJobDetailView.as_view(), name="admin-job-detail"),
    path("applications/", AdminApplicationListView.as_view(), name="admin-applications"),
    path("applications/<int:application_id>/", AdminApplicationDetailView.as_view(), name="admin-application-detail"),
]
