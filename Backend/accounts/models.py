from django.contrib.auth.models import AbstractUser
from django.db import models
import random
from .constants import AccountType

class Accounts(AbstractUser):
    email_verified = models.BooleanField(default=False)
    verification_code = models.CharField(max_length=6, blank=True, null=True)
    account_type = models.CharField(
        max_length=20,
        choices=AccountType.choices(),
        default=AccountType.PATIENT.value
    )

    def generate_verification_code(self):
        self.verification_code = str(random.randint(100000, 999999))
        self.save()

    def __str__(self):
        return f"{self.id}" 
    





