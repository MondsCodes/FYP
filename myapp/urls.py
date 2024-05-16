"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from .views import UserSignupView, BinStatusUpdateAPIView, UserLoginView, CustomTokenObtainPairView, obtain_auth_token, view_token_info
from . import views

urlpatterns = [
    path("register/", UserSignupView.as_view(), name="register"),
    path("login/", UserLoginView.as_view(), name="login"),
    path("user_list/", views.userList, name="users"),
    # Dashboard.js
    path("first_name/", views.firstName, name="firstName"),
    path("recycling_data/", views.recyclingData, name="recyclingData"),
    path("recycling_times/", views.recyclingTimes, name="recyclingTimes"),
    path("recycling_counts/", views.recycling_counts, name="recyclingCounts"),
    # Leaderboard.js
    path("leaderboard/", views.leaderboard, name="leaderboard"),
    #
    path('token/', obtain_auth_token, name='token_obtain_pair'),
    path('token-info/', view_token_info, name='view_token_info'),
    path('disposal/', views.handle_disposal, name='handle_disposal'),
    path('redeem/', views.redeem_points, name='generate_qr_code'),
    path('post_distance/', views.post_distance, name='post_distance'),
    path('bin_status/', BinStatusUpdateAPIView.as_view(), name='bin_status_update'),
    path('bin_status/latest', views.get_latest_bin_status, name='get_latest_bin_status'),

]
