from django.urls import path
from .views import ApplyToJobView, JobDetailView, JobListView

urlpatterns = [path("", JobListView.as_view()), path("<int:pk>/", JobDetailView.as_view()), path("<int:pk>/apply/", ApplyToJobView.as_view())]
