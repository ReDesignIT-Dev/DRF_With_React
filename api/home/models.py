from django.db import models

class Project(models.Model):
    title = models.CharField(max_length=255)
    url = models.CharField(max_length=255, default="https://redesignit.pl")
    image = models.ImageField(upload_to='category_images/', blank=True, null=True)
    description = models.CharField(max_length=255)