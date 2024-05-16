from django.http import JsonResponse
from django.contrib.auth import get_user_model
from rest_framework import generics, status
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from .serializers import (
    UserSignupSerializer, 
    UserLoginSerializer,
    UserListSerializer,
    LeaderboardSerializer)
from .models import User, Item, Redemption, Material
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.core.exceptions import ObjectDoesNotExist
from datetime import timedelta
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
import json
from io import BytesIO
from django.core.files import File
import qrcode
from django.utils.dateparse import parse_datetime
from django.db.models import Count


User = get_user_model()


class UserSignupView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSignupSerializer

    def perform_create(self, serializer):
        user = serializer.save()
        res = {
            "id": user.pk,
            "email": user.email,
        }
        return Response(res, status=status.HTTP_201_CREATED)

    def post(self, request, *args, **kwargs):
        rfid_id = request.data.get('rfid_id')
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        if rfid_id:
            user = User.objects.get(email=serializer.validated_data['email'])
            user.rfid_id = rfid_id
            user.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class UserLoginView(generics.GenericAPIView):
    serializer_class = UserLoginSerializer

    def post(self, request, *args, **kwargs):
        email = request.data.get("email", False)
        password = request.data.get("password", False)
        if email and password:
            try:
                user = User.objects.get(email=email)
                if user.check_password(password):
                    token, created = Token.objects.get_or_create(user=user)
                    res = {
                        "id": user.pk,
                        "email": user.email,
                        "token": str(token.key),
                    }
                    return Response(res, status=status.HTTP_200_OK)
                else:
                    return Response(
                        {"password": ["Wrong password."]},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            except ObjectDoesNotExist:
                return Response(
                    {"email": ["User doesn't exist."]},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        else:
            return Response(
                {"message": ["Email and password are required."]},
                status=status.HTTP_400_BAD_REQUEST,
            )


class CustomTokenObtainPairView(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]

        token_expiration_time = timezone.now() + timedelta(seconds=2)
        token, created = Token.objects.get_or_create(user=user)
        token.expires = token_expiration_time
        token.save()
        return Response({"token": token.key, "user_id": user.pk, "email": user.email})


class ViewTokenInfo(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        token = Token.objects.get(user=user)
        return Response({"token": token.key, "id": user.pk, "email": user.email})

obtain_auth_token = CustomTokenObtainPairView.as_view()
view_token_info = ViewTokenInfo.as_view()


@api_view(["GET"])
def userList(request):
    users = User.objects.all()
    serializer = UserListSerializer(users, many=True)
    data = serializer.data
    return Response(data)


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def firstName(request):
    user_id = request.user.id
    user = User.objects.get(id=user_id)
    data = {
        "id": user.id,
        "first_name": user.first_name,
    }
    return Response(data)


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def recyclingData(request):
    user_id = request.user.id
    user = User.objects.get(id=user_id)
    data = {
        "id": user.id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "points": user.points,
        "total_points_earned": user.total_points_earned,
        "total_points_spent": user.total_points_spent,
        "item_count": user.items_recycled,
        "rewards": user.rewards_redeemed
    }
    return Response(data)


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def recyclingTimes(request):
    user = request.user

    past_day_items = Item.objects.filter(user=user, disposal_time__gte=timezone.now() - timezone.timedelta(days=1))
    past_day_data = get_recycling_data(past_day_items)

    past_7_days_items = Item.objects.filter(user=user, disposal_time__gte=timezone.now() - timezone.timedelta(days=7))
    past_7_days_data = get_recycling_data(past_7_days_items)

    past_30_days_items = Item.objects.filter(user=user, disposal_time__gte=timezone.now() - timezone.timedelta(days=30))
    past_30_days_data = get_recycling_data(past_30_days_items)

    past_90_days_items = Item.objects.filter(user=user, disposal_time__gte=timezone.now() - timezone.timedelta(days=90))
    past_90_days_data = get_recycling_data(past_90_days_items)

    past_year_items = Item.objects.filter(user=user, disposal_time__gte=timezone.now() - timezone.timedelta(days=365))
    past_year_data = get_recycling_data(past_year_items)

    most_recycled_material = Item.objects.filter(user=user).values('material').annotate(total_recycled=Count('material')).order_by('-total_recycled').first()

    data = {
        "user_id": user.id,
        "past_day_data": past_day_data,
        "past_7_days_data": past_7_days_data,
        "past_30_days_data": past_30_days_data,
        "past_90_days_data": past_90_days_data,
        "past_year_data": past_year_data,
        "most_recycled_material": most_recycled_material['material'] if most_recycled_material else None,

    }

    return Response(data)


def get_recycling_data(items):
    return [
        {
            "recycled_material": item.material,
            "disposal_time": item.disposal_time,
        }
        for item in items
    ]


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def recycling_counts(request):
    user = request.user

    today = timezone.now().date()
    past_7_days = [today - timezone.timedelta(days=i) for i in range(6, -1, -1)]  # Generate past 7 days
    past_7_days_counts = [
    Item.objects.filter(
        user=user,
        disposal_time__gte=date,
        disposal_time__lt=date + timezone.timedelta(days=1),
    ).count()
    for date in past_7_days
]

    data = {
        "user_id": user.id,
        "dates": [date.strftime("%Y-%m-%d") for date in past_7_days],
        "counts": past_7_days_counts,
    }

    return Response(data)


@api_view(["GET"])
def leaderboard(request):
    users = User.objects.all().order_by('-total_points_earned')

    rank = 1
    prev_points = None
    for user in users:
        if user.total_points_earned != prev_points:
            user.rank = rank
            rank += 1
            prev_points = user.total_points_earned
        else:
            user.rank = rank - 1

    serializer = LeaderboardSerializer(users, many=True)
    data = serializer.data
    return Response(data)


@csrf_exempt
def handle_disposal(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        
        rfid_id = data.get('rfid_id')
        material_name = data.get('material')
        disposal_time_str = data.get('disposal_time')
        
        disposal_time = parse_datetime(disposal_time_str)

        try:
            user = User.objects.get(rfid_id=rfid_id)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        
        try:
            material = Material[material_name.upper()].value
        except KeyError:
            return JsonResponse({'error': 'Invalid material type'}, status=400)

        item = Item.objects.create(
            user=user,
            recyclable=True,
            disposal_time=disposal_time,
            material=material,
        )

        user.items_recycled += 1
        user.points += 10
        user.total_points_earned += 10
        user.save()

        return JsonResponse({'success': True, 'message': 'Disposal event processed'})

    return JsonResponse({'error': 'Invalid request method'}, status=405)


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def redeem_points(request):
    points_to_use = request.data.get('points_to_use')
    user = request.user 

    if points_to_use is None:
        return Response({'error': 'Missing points_to_use'}, status=400)

    try:
        points_to_use = int(points_to_use)
    except ValueError:
        return Response({'error': 'points_to_use must be an integer'}, status=400)

    if points_to_use <= 0:
        return Response({'error': 'Points to use must be greater than 0'}, status=400)

    if user.points < points_to_use:
        return Response({'error': 'Insufficient points'}, status=400)

    discount_percentage = min(points_to_use // 200 * 10, 100) 

    qr_data = f"user_id={user.id}&points_used={points_to_use}&discount={discount_percentage}"
    qr_img = qrcode.make(qr_data)
    buffer = BytesIO()
    qr_img.save(buffer, format="PNG")
    buffer.seek(0)

    redemption = Redemption(user=user, points_used=points_to_use, discount_applied=discount_percentage)
    redemption.save()

    filename = f"redemption_{redemption.id}.png"
    redemption.qr_code.save(filename, File(buffer))

    user.points -= points_to_use
    user.rewards_redeemed += 1
    user.total_points_spent += points_to_use
    user.save()

    qr_code_url = redemption.qr_code.url
    return Response({'success': True, 'qr_code_url': qr_code_url})

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import DistanceMeasurement
import json

@csrf_exempt
def post_distance(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            distance = data['distance']
            DistanceMeasurement.objects.create(distance=distance)
            return JsonResponse({"success": True}, status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import BinStatus
from .serializers import BinStatusSerializer

class BinStatusUpdateAPIView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = BinStatusSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


from django.http import JsonResponse
from rest_framework.decorators import api_view
from .models import BinStatus

@api_view(['GET'])
def get_latest_bin_status(request):
    latest_bin_status = BinStatus.objects.order_by('-update_time').first()
    if latest_bin_status:
        data = {
            'distance': latest_bin_status.distance,
            'update_time': latest_bin_status.update_time,
        }
        return JsonResponse(data)
    else:
        return JsonResponse({'error': 'No bin status found'}, status=404)
