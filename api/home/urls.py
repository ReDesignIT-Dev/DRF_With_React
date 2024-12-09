from django.urls import path

from api.home.views import ProjectListCreateView

urlpatterns = [
    path('projects/', ProjectListCreateView.as_view(), name='projects'),
    ]