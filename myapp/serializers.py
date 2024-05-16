from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer



User = get_user_model()


class UserSignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['rfid_id', 'first_name', 'last_name', 'phone_number', 'date_of_birth', 'email', 'password', 'points', 'items_recycled', 'rewards_redeemed']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        rfid_id = validated_data.pop('rfid_id', None)
        user = User.objects.create_user(**validated_data)
        if rfid_id:
            user.rfid_id = rfid_id  
            user.save()
        return user


class UserLoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "password"]
        extra_kwargs = {"password": {"write_only": True}}


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["id"] = user.id
        return token


class UserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name']

class LeaderboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'items_recycled', 'points', 'total_points_earned']


from rest_framework import serializers
from .models import BinStatus

class BinStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = BinStatus
        fields = ['distance', 'update_time']
