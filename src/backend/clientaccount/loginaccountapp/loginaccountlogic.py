from rest_framework import serializers
from django.contrib.auth import authenticate

class LoginAccountLogic(serializers.Serializer):
    username = serializers.CharField() #specifically declare as a str
    password = serializers.CharField() #specifically declare as a str

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        user = authenticate(username=username, password=password)

        if not user:
            raise serializers.ValidationError("Invalid Username or Password")
        
        data["user"] = user

        return data