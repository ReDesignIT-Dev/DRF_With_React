from settings_base import *
from os import getenv
from dotenv import load_dotenv

load_dotenv()

DEBUG = False
ALLOWED_HOSTS = ['www.redesignit.pl']

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
DRF_RECAPTCHA_SECRET_KEY = getenv('RECAPTCHA_PRIVATE_KEY')

STATIC_ROOT = os.path.join(BASE_DIR, 'static')
