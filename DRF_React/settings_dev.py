from .settings_base import *

PROJECT_NAME_FOR_DEV_DB = "DRF_React"  # my custom name for creating the dev db and user
DEV_DB = getenv('DEV_DB')  # changing the value in .env gives possibility to use sqlite or postgres
DEBUG = True
ALLOWED_HOSTS = ['localhost', '127.0.0.1']

# Default database configuration for SQLite
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}

# If DEV_DB is 'postgres', override the default database configuration
if DEV_DB == 'postgres':
    DATABASES['default'] = {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'localtestdb_' + PROJECT_NAME_FOR_DEV_DB,
        'USER': 'testuser_' + PROJECT_NAME_FOR_DEV_DB,
        'PASSWORD': 'TestPassword_' + PROJECT_NAME_FOR_DEV_DB,
        'HOST': 'localhost',
        'PORT': '5432',
    }
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # React app
    "http://127.0.0.1:3000",  # React app
    "http://172.16.0.233:3000"  # React app
]
SILENCED_SYSTEM_CHECKS = ['drf_recaptcha.recaptcha_test_key_error']
DRF_RECAPTCHA_SECRET_KEY = "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe"  # JUST FOR DEV UNIVERSAL GOOGLE KEY
DRF_RECAPTCHA_TESTING=True
DRF_RECAPTCHA_TESTING_PASS=True
# FRONTEND DEVELOPER KEY FOR EVERYONE IS: 6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
# BASED ON WEBPAGE INFO:
# https://developers.google.com/recaptcha/docs/faq?hl=pl#id-like-to-run-automated-tests-with-recaptcha.-what-should-i-do
