from .settings_base import *

DEBUG = True
ALLOWED_HOSTS = ['localhost', '127.0.0.1']
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'localtestdb',
        'USER': 'testuser',
        'PASSWORD': 'TestPassword',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # React app
    "http://127.0.0.1:3000",  # React app
]
SILENCED_SYSTEM_CHECKS = ['django_recaptcha.recaptcha_test_key_error']