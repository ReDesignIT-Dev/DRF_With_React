from rest_framework import serializers
from .models import CustomUser
from django.contrib.auth import authenticate


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'email_confirmed', 'first_name', 'last_name', 'password')
        extra_kwargs = {
            'id': {'read_only': True},  # Make 'id' read-only
            'email_confirmed': {'read_only': True},  # Make 'email_confirmed' read-only
            'first_name': {'required': False},  # Make 'first_name' optional
            'last_name': {'required': False},  # Make 'last_name' optional
        }


class CustomLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

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
