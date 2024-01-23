from .settings_base import *

DEBUG = True
ALLOWED_HOSTS = ['localhost', '127.0.0.1']

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

SILENCED_SYSTEM_CHECKS = ['django_recaptcha.recaptcha_test_key_error']
print(f'Finished the dev settings with debug = {DEBUG}')