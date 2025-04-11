from enum import Enum

class AccountType(Enum):
    PATIENT = "PATIENT"
    DOCTOR = "DOCTOR"

    @classmethod
    def choices(cls):
        return [(tag.value, tag.name) for tag in cls]
