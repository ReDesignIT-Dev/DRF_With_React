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
DRF_RECAPTCHA_SECRET_KEY = getenv('RECAPTCHA_PUBLIC_KEY')
SILENCED_SYSTEM_CHECKS = ['django_recaptcha.recaptcha_test_key_error']