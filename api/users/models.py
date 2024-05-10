from django.contrib.auth.models import AbstractUser, UserManager
from django.db import models
import unicodedata


class CustomUserManager(UserManager):

    def _create_user(self, username, email, password, **extra_fields):
        if not username:
            raise ValueError("Username is required")
        if not email:
            raise ValueError("Email is required")
        username = self.normalize_username(username)
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_staffuser(self, username, email, password):
        """
        Creates and saves a staff user with the given email and password.
        """
        user = self.create_user(
            username,
            email,
            password=password,
        )
        user.staff = True
        user.save(using=self._db)
        return user


class CustomUser(AbstractUser):
    username = models.CharField(max_length=30, unique=True)
    email_confirmed = models.BooleanField(default=False)
    email = models.EmailField(unique=True, max_length=254, verbose_name='email address')

    objects = CustomUserManager()
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.username
