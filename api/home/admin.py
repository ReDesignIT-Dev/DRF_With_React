from django.contrib import admin

from api.home.models import Project


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'image', 'description')
    search_fields = ['title']
