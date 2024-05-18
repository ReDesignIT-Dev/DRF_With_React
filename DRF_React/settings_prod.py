from settings_base import *
from os import getenv
from dotenv import load_dotenv

load_dotenv()

DEBUG = False
ALLOWED_HOSTS = ['www.redesignit.pl']
DRF_RECAPTCHA_SECRET_KEY = getenv('RECAPTCHA_PRIVATE_KEY')

# Email settings
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_USE_TLS = True
EMAIL_HOST = getenv('EMAIL_HOST')
EMAIL_PORT = getenv('EMAIL_PORT')
EMAIL_HOST_USER = getenv('EMAIL')
EMAIL_HOST_PASSWORD = getenv('EMAIL_PASSWORD')

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': getenv('DJANGO_DB'),
        'USER': getenv('DJANGO_DB_USER'),
        'PASSWORD': getenv('DJANGO_DB_PASSWORD'),
        'HOST': 'localhost',
        'PORT': '5432',
    }
}


STATIC_ROOT = os.path.join(BASE_DIR, 'static')
