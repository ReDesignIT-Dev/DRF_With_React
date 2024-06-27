from datetime import timedelta
from django.template.loader import render_to_string
from django.utils import timezone
from rest_framework.fields import empty
from rest_framework.serializers import Serializer, ModelSerializer, CharField, ValidationError, EmailField
from .email_sender import EmailSender
from .models import CustomUser
from drf_recaptcha.fields import ReCaptchaV2Field
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ObjectDoesNotExist
from django.conf import settings

frontend_url = settings.FRONTEND_URL


class V2Serializer(Serializer):
    recaptcha = ReCaptchaV2Field()


class PasswordValidationMixin(Serializer):
    password = CharField(write_only=True, max_length=128)
    password_confirm = CharField(write_only=True, max_length=128)

    def validate_password(self, password):
        validate_password(password)
        return password

    def validate(self, attrs):
        password = attrs.get('password')
        password_confirm = attrs.get('password_confirm')
        if password != password_confirm:
            raise ValidationError({'password_confirm': ["Passwords do not match"]})

        return attrs


class CustomUserRegisterSerializer(PasswordValidationMixin, ModelSerializer, V2Serializer):
    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'password', 'password_confirm', 'recaptcha')

    def __init__(self, instance=None, data=empty, **kwargs):
        super().__init__(instance, data, **kwargs)
        self.user = None

    def create(self, validated_data):
        validated_data.pop('recaptcha')
        validated_data.pop('password_confirm')
        self.user = CustomUser.objects.create_user(**validated_data)
        self.user.generate_activation_token()
        self.send_activation_email()
        return self.user

    def send_activation_email(self):
        activation_link = f"{frontend_url}/activate/{self.user.activation_token}"
        html_content = render_to_string('user_activation_template.html', {
            'username': self.user.username,
            'activation_link': activation_link,
        })
        with EmailSender() as email_sender:
            email_sender.send_email(
                recipient=self.user.email,
                subject='Activate your account',
                message_content=html_content
            )


class UserActivationSerializer(Serializer):
    token = CharField()

    class Meta:
        model = CustomUser

    def __init__(self, instance=None, data=empty, **kwargs):
        super().__init__(instance, data, **kwargs)
        self.user = None

    def validate_token(self, value):
        try:
            self.user = self.Meta.model.objects.get(activation_token=value)
        except ObjectDoesNotExist:
            raise ValidationError('Invalid activation token')
        return value

    def save(self):
        self.user.is_active = True
        self.user.email_confirmed = True
        self.user.activation_token = None
        self.user.save()
        return self.user


class CustomUserLoginSerializer(V2Serializer):
    class Meta:
        model = CustomUser
        fields = ('recaptcha',)

    def validate(self, data):
        user = self.context['request'].user
        if not user or not user.is_authenticated:
            raise ValidationError("Invalid login credentials. Please try again.")
        if not user.is_active:
            raise ValidationError("User not activated yet - check email")
        data['user'] = user
        return data


class PasswordResetSerializer(V2Serializer):
    email = EmailField(max_length=255)

    class Meta:
        model = CustomUser
        fields = ('recaptcha',)

    def __init__(self, instance=None, data=empty, **kwargs):
        super().__init__(instance, data, **kwargs)
        self.user = None

    def validate_email(self, email):
        try:
            self.user = self.Meta.model.objects.get(email=email)
            if not self.user.is_active:
                if self.user.email_confirmed:
                    raise ValidationError('User banned')
                else:
                    raise ValidationError('User not activated yet')
            elif self.user.password_reset_token is not None:
                raise ValidationError('Password recovery link already sent')
        except ObjectDoesNotExist:
            raise ValidationError('User with this email does not exist')
        return email

    def send_password_recovery_email(self):
        request = self.context.get('request')
        if not request:
            raise ValidationError('Request context is missing')
        recovery_link = f"{frontend_url}/password-reset/{self.user.password_reset_token}"
        html_content = render_to_string('user_password_recovery_template.html', {
            'username': self.user.username,
            'recovery_link': recovery_link,
        })
        with EmailSender() as email_sender:
            email_sender.send_email(
                recipient=self.user.email,
                subject='Password reset',
                message_content=html_content
            )

    def save(self):
        if not self.user:
            raise ValidationError("User not found. Validate the token first.")
        self.user.generate_password_reset_token()


class PasswordResetActivationSerializer(Serializer):
    token = CharField()

    class Meta:
        model = CustomUser

    def __init__(self, instance=None, data=empty, **kwargs):
        super().__init__(instance, data, **kwargs)
        self.user = None

    def validate_token(self, value):
        try:
            self.user = self.Meta.model.objects.get(password_reset_token=value)
        except ObjectDoesNotExist:
            raise ValidationError('Invalid password recovery token')
        return value


class PasswordSetNewPasswordSerializer(PasswordValidationMixin, V2Serializer):
    TOKEN_EXPIRE_TIME_HOURS = 1
    token = CharField()

    class Meta:
        model = CustomUser
        fields = ('recaptcha',)

    def __init__(self, instance=None, data=empty, **kwargs):
        super().__init__(instance, data, **kwargs)
        self.user = None

    def validate_token(self, value):
        try:
            self.user = self.Meta.model.objects.get(password_reset_token=value)
        except ObjectDoesNotExist:
            raise ValidationError('Invalid password recovery token')

        if self.user.password_reset_token_created_at:
            token_age = timezone.now() - self.user.password_reset_token_created_at
            if token_age > timedelta(hours=self.TOKEN_EXPIRE_TIME_HOURS):
                self.user.password_reset_token = None
                self.user.save()
                raise ValidationError('Password recovery token has expired')

        return value

    def save(self):
        if not self.user:
            raise ValidationError("User not found. Validate the token first.")
        self.user.set_password(self.validated_data['password'])
        self.user.password_reset_token = None
        self.user.save()
