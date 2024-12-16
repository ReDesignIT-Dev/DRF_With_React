import os
from pathlib import Path
from os import getenv
from dotenv import load_dotenv
from datetime import timedelta
from rest_framework.settings import api_settings

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = getenv('DJANGO_SECRET_KEY')

AUTHENTICATION_BACKENDS = ['api.users.backends.CustomBackend']

FRONTEND_URL = getenv('FRONTEND_URL')

LOGIN_URL = 'login'
AUTH_USER_MODEL = 'users.CustomUser'
ACCOUNT_ACTIVATION_DAYS = 7

REGISTRATION_SALT = getenv('REGISTRATION_SALT')

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'knox.auth.TokenAuthentication',
    ),
}

KNOX_TOKEN_MODEL = 'knox.AuthToken'

REST_KNOX = {
    'SECURE_HASH_ALGORITHM': 'hashlib.sha512',  # may require direct download crypto.py to work
    'AUTH_TOKEN_CHARACTER_LENGTH': 64,
    'TOKEN_TTL': timedelta(hours=24),
    'USER_SERIALIZER': 'api.users.serializers.CustomUserLoginSerializer',
    'TOKEN_LIMIT_PER_USER': None,
    'AUTO_REFRESH': True,
    'MIN_REFRESH_INTERVAL': 60,
    'AUTH_HEADER_PREFIX': 'Token',
    'EXPIRY_DATETIME_FORMAT': api_settings.DATETIME_FORMAT,
    'TOKEN_MODEL': 'knox.AuthToken',
}

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    "corsheaders",
    'django_filters',
    'api.home',
    'api.shop',
    'api.users',
    'drf_recaptcha',
    'rest_framework.authtoken',
    'knox',
    'django_extensions',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'api.shop.middleware.LogRequestMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# Email settings
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL = getenv('EMAIL')
EMAIL_PASSWORD = getenv('EMAIL_PASSWORD')
EMAIL_SMTP = getenv('SMTP_SERVER')
EMAIL_SSL_ENABLED = getenv('SSL_ENABLED')
EMAIL_PORT = getenv('EMAIL_PORT')

ROOT_URLCONF = 'DRF_React.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
            'builtins': [
                'django.templatetags.static',
            ],
        },
    },
]

WSGI_APPLICATION = 'DRF_React.wsgi.application'

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
    {
        'NAME': 'api.users.validators.PasswordCharacterValidator',
        'OPTIONS': {
            'min_length_digit': 1,
            'min_length_alphanumeric': 1,
            'min_length_special': 1,
            'min_length_lower': 1,
            'min_length_upper': 1,
            'special_characters': r'[@$!%*?&#^()]'
        }
    },
]

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': os.path.join(BASE_DIR, 'debug.log'),
        },
    },
    'loggers': {
         #'django': {
         #    'handlers': ['file'],
         #    'level': 'DEBUG',
         #    'propagate': True,
         #},
        'api.shop.middleware': {
            'handlers': ['file'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = False
USE_TZ = True

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

STATICFILES_DIRS = [
    BASE_DIR / "staticfiles",
]

FRONTEND_ROOT = os.path.abspath(os.path.join(BASE_DIR, 'frontend', 'build'))

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
