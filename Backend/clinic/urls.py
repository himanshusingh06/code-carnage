from django.urls import path
from . import views

urlpatterns = [
    path("create/", views.ClinicAPIView.as_view(), name="clinic-listcreate"),
    path('doctor/', views.DoctorListCreateView.as_view(), name='doctor-create'),
    path('appointments/', views.AppointmentListCreateView.as_view(), name='appointment-list-create'),
    path('prescriptions/', views.PrescriptionCreateListView.as_view(), name='prescription-list-create'),
    path('drug-side-effects/', views.get_side_effects, name='drug-side-effects'),
]