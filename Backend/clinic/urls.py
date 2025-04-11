from django.urls import path
from . import views

urlpatterns = [
    path("create/", views.ClinicAPIView.as_view(), name="clinic-listcreate"),
    path('doctor/', views.DoctorListCreateView.as_view(), name='doctor-create'),
]