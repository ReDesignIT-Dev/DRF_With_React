from django.urls import path

from api.home.views import ProjectListView

urlpatterns = [
    path('projects', ProjectListView.as_view(), name='projects'),
    ]