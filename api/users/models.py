import secrets
from django.utils import timezone
from django.contrib.auth.models import AbstractUser, UserManager
from django.db import models
import unicodedata


class CustomUserManager(UserManager):

    @classmethod
    def normalize_username(cls, username):
        return (
            unicodedata.normalize("NFKC", username)
            if isinstance(username, str)
            else username
        )

    @classmethod
    def normalize_email(cls, email):
        """
        Normalize the email address by lowercasing the domain part of it.
        """
        email = email or ""
        try:
            email_name, domain_part = email.strip().rsplit("@", 1)
        except ValueError:
            pass
        else:
            email = email_name.lower() + "@" + domain_part.lower()
        return email

    def _create_user(self, username, email, password, **extra_fields):
        if not username:
            raise ValueError("Username is required")
        if not email:
            raise ValueError("Email is required")
        if not password:
            raise ValueError("Password is required")
        username = self.normalize_username(username)
        email = self.normalize_email(email)
        date_joined = timezone.now().replace(microsecond=0)
        user = self.model(username=username, email=email, date_joined=date_joined, **extra_fields)
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
    activation_token = models.CharField(max_length=64, blank=True, null=True)
    password_reset_token = models.CharField(max_length=64, blank=True, null=True)
    password_reset_token_created_at = models.DateTimeField(blank=True, null=True, default=None)

    objects = CustomUserManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.username

    def generate_activation_token(self):
        self.activation_token = self._generate_user_based_token()
        self.save()

    def generate_password_reset_token(self):
        self.password_reset_token = self._generate_user_based_token()
        self.password_reset_token_created_at = timezone.now()
        self.save()

    @staticmethod
    def _generate_token():
        return secrets.token_urlsafe(32)

    def _generate_user_based_token(self):
        return self._generate_token() + str(self.pk)
