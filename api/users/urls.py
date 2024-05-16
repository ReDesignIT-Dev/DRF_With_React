from django.urls import path
from .views import RegisterView, LoginView, LogoutView, LogoutAllView, ForLoggedInOnlyView
from knox import views as knox_views

urlpatterns = [
    path('register/', RegisterView.as_view(), name='api-register'),
    path('login/', LoginView.as_view(), name='api-login'),
    path('logout/', LogoutView.as_view(), name='api-logout'),
    path('logoutall/', LogoutAllView.as_view(), name='api-logoutall'),
    path('secrets/', ForLoggedInOnlyView.as_view(), name='secret-content'),
]
