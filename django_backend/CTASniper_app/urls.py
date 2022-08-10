from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.homepage),
    path('signup', views.sign_up),
    path('login', views.log_in),
    path('logout', views.log_out),
    path('whoami', views.who_am_i),
    path('get_train_data', views.get_train_data),
    path('get_place', views.get_place),
    path('get_stations', views.get_stations),
    path('calculate_walk', views.calculate_walk)
]

