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
    





# i want an api to create and list client using listcreateviewapi provide serializer.py 
# dont put any ligic in serializers like create() only validate fields provide views.py use perform_create() for business logic and db interaction and error handling in create () only validate and return custom response in the format {"messge": "successfull", "data" : {}}

# also provide urls.py for the same