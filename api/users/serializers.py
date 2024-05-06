from rest_framework import serializers
from rest_registration.api.serializers import DefaultRegisterUserSerializer, DefaultLoginSerializer
from .models import CustomUser
from django.contrib.auth import authenticate
from drf_recaptcha.fields import ReCaptchaV2Field


class CustomUserSerializer(DefaultRegisterUserSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'password', 'password_confirm', 'recaptcha')
        extra_kwargs = {
            'recaptcha': {'required': True},
        }

    def get_fields(self):
        fields = super().get_fields()
        fields['recaptcha'] = ReCaptchaV2Field()
        return fields

    def create(self, validated_data):
        password_confirm = validated_data.pop('password_confirm', None)
        recaptcha = validated_data.pop('recaptcha', None)
        user = CustomUser.objects.create_user(**validated_data)
        return user

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Remove 'first_name' and 'last_name' fields from serializer
        self.fields.pop('first_name', None)
        self.fields.pop('last_name', None)
        self.fields.pop('email_confirmed', None)


class CustomLoginSerializer(DefaultLoginSerializer):

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if email and password:
            user = authenticate(request=self.context.get('request'), username=email, password=password)

            if not user:
                raise serializers.ValidationError("Invalid login credentials. Please try again.")

            data['user'] = user
        else:
            raise serializers.ValidationError("Both email and password are required for login.")

        return data
