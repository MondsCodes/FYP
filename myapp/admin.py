from django.contrib import admin
from .models import User, Item, Reward, Redemption

class UserAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "rfid_id",
        "first_name",
        "last_name",
        "phone_number",
        "email",
        "date_of_birth",
        "items_recycled",
        "total_points_earned",
        "points",
        "rewards_redeemed",
        "is_active",
    ]

admin.site.register(User, UserAdmin)
admin.site.register(Item)
admin.site.register(Reward)
admin.site.register(Redemption)
