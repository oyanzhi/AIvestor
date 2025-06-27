from rest_framework import serializers
from registeraccountapp.models import AccountDatabase
from django.contrib.auth.hashers import make_password

class ProfileUpdateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    confirmpassword = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = AccountDatabase
        fields = ['display_name', 'username', 'password', 'confirmpassword', 'risk_tolerance', 'alert_threshold']

    def validate_username(self, value):#username validation
        user = self.context['request'].user
        if AccountDatabase.objects.filter(username=value).exclude(id=user.id).exists():
            raise serializers.ValidationError("Username is already taken.")
        return value

    def validate(self, data):#password validation
        password = data.get("password")
        confirmpassword = data.get("confirmpassword")
        if password:
            if len(password) < 8: # current simple check for password
                raise serializers.ValidationError("Password must be at least 8 characters long.")
        
            if password != confirmpassword:
                raise serializers.ValidationError("Passwords do not match.")

        return data

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        validated_data.pop('confirmpassword', None)

        if password:
            instance.password = make_password(password)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance
