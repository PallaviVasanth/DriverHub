from rest_framework import generics
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from apps.applications.models import Application
from apps.applications.serializers import ApplicationSerializer
from apps.common.permissions import IsCandidate
from apps.notifications.views import NotificationListView, NotificationReadView
from .models import CandidateProfile
from .serializers import CandidateProfileSerializer


class CandidateProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsCandidate]
    serializer_class = CandidateProfileSerializer
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def get_object(self):
        return CandidateProfile.objects.get(user=self.request.user)


class CandidateResumeView(CandidateProfileView):
    def post(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)


class CandidatePhotoView(CandidateProfileView):
    def post(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)


class CandidateApplicationsView(generics.ListAPIView):
    permission_classes = [IsCandidate]
    serializer_class = ApplicationSerializer

    def get_queryset(self):
        return Application.objects.filter(candidate__user=self.request.user).select_related("job__employer", "candidate__user")


class CandidateNotificationListView(NotificationListView):
    permission_classes = [IsCandidate]


class CandidateNotificationReadView(NotificationReadView):
    permission_classes = [IsCandidate]
