from django.urls import path
from .views import CandidateApplicationsView, CandidateNotificationListView, CandidateNotificationReadView, CandidatePhotoView, CandidateProfileView, CandidateResumeView

urlpatterns = [
    path("profile/", CandidateProfileView.as_view()),
    path("profile/resume/", CandidateResumeView.as_view()),
    path("profile/photo/", CandidatePhotoView.as_view()),
    path("applications/", CandidateApplicationsView.as_view()),
    path("notifications/", CandidateNotificationListView.as_view()),
    path("notifications/<int:pk>/read/", CandidateNotificationReadView.as_view()),
]
