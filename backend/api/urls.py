from django.urls import path
from .views import RegisterView, LoginView, update_profile_by_email, community_impact_map

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('update-profile-by-email/', update_profile_by_email, name='update-profile-by-email'),
    path('community-impact-map/', community_impact_map, name='community-impact-map'),
]
