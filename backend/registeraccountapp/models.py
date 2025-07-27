from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager


# Manager
class AccountDatabaseManager(BaseUserManager):
    def create_user(self, username, email, password, **extra_fields):
        if not email or not password:
            raise ValueError("Missing Email or Password")

        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self.db)
        return user

    # currently super users are not used yet but can be created
    def create_superuser(self, username, email, password, **extra_fields):
        extra_fields.setdefault("is_staff", True)

        if not extra_fields.get("is_staff"):
            raise ValueError("Superuser must have is_staff=True.")

        return self.create_user(username, email, password, **extra_fields)

    def get_by_natural_key(self, username):
        return self.get(username=username)  # key differentiating is username


# User
class AccountDatabase(AbstractBaseUser):
    # fields stored in database
    id = models.AutoField(
        primary_key=True, null=False, unique=True
    )  # Auto-incrementing primary key for the account
    username = models.CharField(
        null=False, unique=True
    )  # Unique username for the account/ uniqueness checked at registration for custom message
    email = models.EmailField(
        null=False, unique=True
    )  # Unique email address for the account/ uniqueness checked at registration for custom message
    password = models.CharField()  # Password for the account
    display_name = models.CharField(
        max_length=100, blank=True, verbose_name="Display Name", default=""
    )
    risk_tolerance = models.CharField(
        max_length=10,
        choices=[("Low", "Low"), ("Medium", "Medium"), ("High", "High")],
        default="Medium",
    )
    alert_threshold = models.IntegerField(default=10)
    created_at = models.DateTimeField(
        auto_now_add=True
    )  # Timestamp of when the account was created
    last_login = models.DateTimeField(blank=True, null=True, verbose_name="Last Login")
    is_active = models.BooleanField(default=True, verbose_name="Is Active")
    is_staff = models.BooleanField(default=False, verbose_name="Is Staff")

    REQUIRED_FIELDS = ["email"]  # only for superusers
    USERNAME_FIELD = "username"  # always required

    objects = AccountDatabaseManager()

    class Meta:
        # managed = False
        db_table = "account"
        # Specifies the database table name for this model

    def __str__(self):
        return self.username  # String representation of the model, returns the username
