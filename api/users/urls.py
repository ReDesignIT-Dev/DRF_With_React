from django.urls import path
from .views import RegisterView, LoginView, LogoutView, LogoutAllView, ValidateToken, UserActivationView, \
    UserPasswordResetView, UserPasswordResetActivationView

urlpatterns = [
    path('register', RegisterView.as_view(), name='api-register'),
    path('activate/<str:token>', UserActivationView.as_view(), name='activate-user'),
    path('password-reset', UserPasswordResetView.as_view(), name='password-reset'),
    path('password-reset/<str:token>', UserPasswordResetActivationView.as_view(),
         name='password-reset-activation'),
    path('login', LoginView.as_view(), name='api-login'),
    path('logout', LogoutView.as_view(), name='api-logout'),
    path('logout-all', LogoutAllView.as_view(), name='api-logout-all'),
    path('validate-token', ValidateToken.as_view(), name='validate-token'),
]
