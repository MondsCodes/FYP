from django.db import models
from enum import Enum

# Create your models here.
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    rfid_id = models.CharField(max_length=100, unique=True, blank=True, null=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    email = models.EmailField(unique=True)
    date_of_birth = models.DateField()
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    items_recycled = models.PositiveIntegerField(default=0)
    points = models.PositiveIntegerField(default=0)
    total_points_earned = models.PositiveIntegerField(default=0)
    total_points_spent = models.PositiveIntegerField(default=0)
    rewards_redeemed = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'date_of_birth']


class Material(Enum):
    PLASTIC = "Plastic"
    PAPER = "Paper"
    CARDBOARD = "Cardboard"
    METAL = "Metal"
    GLASS = "Glass"
    WASTE = "Waste"


class Item(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    recyclable = models.BooleanField()
    disposal_time = models.DateField(default="2000-01-01")
    material = models.CharField(
        max_length=200,
        choices=[(tag.name, tag.value) for tag in Material],
        blank=True,
        null=True,
    )

class Reward(models.Model):
    name = models.CharField(max_length=255)
    points_required = models.PositiveIntegerField()
    description = models.TextField()

class Redemption(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    points_used = models.IntegerField(default=0)
    discount_applied = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)
    qr_code = models.ImageField(upload_to='redemptions/', blank=True, null=True)

class DistanceMeasurement(models.Model):
    distance = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

class BinStatus(models.Model):
    distance = models.FloatField()
    update_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.distance} cm on {self.update_time}"