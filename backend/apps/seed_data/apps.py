from django.apps import AppConfig


class SeedDataConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.seed_data"
    label = "seed_data"
