from .settings_base import *

DEBUG = True
ALLOWED_HOSTS = ['localhost', '127.0.0.1']
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'localtestdb_DRF_React',
        'USER': 'testuser_DRF_React',
        'PASSWORD': 'TestPassword_DRF_React',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # React app
    "http://127.0.0.1:3000",  # React app
    "http://172.16.0.233:3000"  # React app
]
SILENCED_SYSTEM_CHECKS = ['drf_recaptcha.recaptcha_test_key_error']
DRF_RECAPTCHA_SECRET_KEY = "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe"  # JUST FOR DEV UNIVERSAL GOOGLE KEY
# FRONTEND DEVELOPER KEY FOR EVERYONE IS: 6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
# BASED ON WEBPAGE INFO: https://developers.google.com/recaptcha/docs/faq?hl=pl#id-like-to-run-automated-tests-with-recaptcha.-what-should-i-do
