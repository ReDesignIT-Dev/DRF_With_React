from DRF_React.settings_base import *
from os import getenv
from dotenv import load_dotenv

load_dotenv()

DEBUG = False
ALLOWED_HOSTS = ['api.redesignit.pl', 'redesignit.pl']
CORS_ALLOWED_ORIGINS = ["https://redesignit.pl",]

CSRF_TRUSTED_ORIGINS = ["https://api.redesignit.pl", "https://redesignit.pl"]

CORS_ORIGIN_WHITELIST = ["http://api.redesignit.pl", "https://redesignit.pl",]
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOW_CREDENTIALS = True
DRF_RECAPTCHA_SECRET_KEY = getenv('RECAPTCHA_PRIVATE_KEY')

SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
#USE_X_FORWARDED_HOST = True
#SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')


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
