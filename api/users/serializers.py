from django.template.loader import render_to_string
from rest_framework.fields import empty
from rest_framework.serializers import Serializer, ModelSerializer, CharField, ValidationError, EmailField
from .email_sender import EmailSender
from .models import CustomUser
from django.contrib.auth import authenticate
from drf_recaptcha.fields import ReCaptchaV2Field
from django.contrib.auth.password_validation import validate_password
from django.urls import reverse
from django.core.exceptions import ObjectDoesNotExist


class V2Serializer(Serializer):
    recaptcha = ReCaptchaV2Field()


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
        self.user.save()
        self.user.activation_token = None  # Clear the token after activation
        self.user.save()
        return self.user


class PasswordResetSerializer(Serializer):
    email = EmailField(max_length=255)

    class Meta:
        model = CustomUser

    def __init__(self, instance=None, data=empty, **kwargs):
        super().__init__(instance, data, **kwargs)
        self.user = None

    def validate_email(self, email):
        try:
            self.user = self.Meta.model.objects.get(email=email)
            if not self.user.is_active:
                raise ValidationError('User not activated yet')
            elif self.user.activation_token is not None:
                raise ValidationError('Password recovery link already sent')
            else:
                self.user.generate_activation_token()
                self.send_password_recovery_email(self.user)
        except ObjectDoesNotExist:
            raise ValidationError('User with this email does not exist')
        return email

    def send_password_recovery_email(self, user):
        request = self.context.get('request')
        if not request:
            raise ValidationError('Request context is missing')
        recovery_path = reverse('password-reset-activation', kwargs={'token': user.activation_token})
        recovery_link = request.build_absolute_uri(recovery_path)
        html_content = render_to_string('user_password_recovery_template.html', {
            'username': user.username,
            'recovery_link': recovery_link,
        })
        with EmailSender() as email_sender:
            email_sender.send_email(
                recipient=user.email,
                subject='Password reset',
                message_content=html_content
            )

class PasswordResetActivationSerializer(Serializer):
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
        self.user.save()
        self.user.activation_token = None  # Clear the token after activation
        self.user.save()
        return self.user


class CustomUserRegisterSerializer(ModelSerializer, V2Serializer):
    password = CharField(write_only=True)
    password_confirm = CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'password', 'password_confirm', 'recaptcha')

    def create(self, validated_data):
        validated_data.pop('recaptcha')
        validated_data.pop('password_confirm')
        user = CustomUser.objects.create_user(**validated_data)
        user.generate_activation_token()
        self.send_activation_email(user)
        return user

    def send_activation_email(self, user):
        activation_link = self.context['request'].build_absolute_uri(
            reverse('activate-user', kwargs={'token': user.activation_token})
        )
        html_content = render_to_string('user_activation_template.html', {
            'username': user.username,
            'activation_link': activation_link,
        })
        with EmailSender() as email_sender:
            email_sender.send_email(
                recipient=user.email,
                subject='Activate your account',
                message_content=html_content
            )

    def validate(self, attrs):
        password = attrs.get('password')
        password_confirm = attrs.get('password_confirm')

        if password != password_confirm:
            raise ValidationError("Passwords do not match")
        validate_password(password)
        return attrs


class CustomUserLoginSerializer(V2Serializer):
    email = EmailField(write_only=True)
    password = CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ('email', 'password', 'recaptcha')

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        if email and password:
            user = authenticate(request=self.context.get('request'), username=email, password=password)
            if not user:
                raise ValidationError("Invalid login credentials. Please try again.")
            data['user'] = user
        else:
            raise ValidationError("Both email and password are required for login.")

        return data
