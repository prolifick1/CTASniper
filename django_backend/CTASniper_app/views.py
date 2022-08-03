from django.shortcuts import render
from django.http import HttpResponse
from django.core import serializers
from django.contrib.auth import authenticate, login, logout
from .models import AppUser as User
from rest_framework.decorators import api_view

# change csrf restrictions for unauthenticated users with api_view decorators
def homepage(request):
    print('homepage')
    index = open('static/index.html').read()
    return HttpResponse(index)

@api_view(['POST'])
def sign_up(request):
    try:
        User.objects.create_user(
            username=request.data['email'],
            password=request.data['password'],
            email=request.data['email']
        )
    except Exception as e:
        print(str(e))
    return HttpResponse('sign up: hi')

@api_view(['POST'])
def log_in(request):
    email = request.data['email']
    password = request.data['password']
    user = authenticate(username=email, password=password, email=email)
    print(f'>>>>>>>>>>>>>>>>>>>>user? {user.email} {user.password}')

    if user is not None:
        if user.is_active:
            try:
                #access the base request, not the DRF request
                #this starts a login session for this user
                login(request._request, user)
            except Exception as e:
                print('exception at login')
                print(str(e))
            return HttpResponse('success!')
        else:
            return HttpResponse('user not active! login')
            # todo: return a disabled account error message
    else:
        return HttpResponse('no user')
        # todo: return 'invalid login' error message

@api_view(['POST'])
def log_out(request):
    logout(request)
    return JsonResponse({ 'success': True })

@api_view(['GET'])
def who_am_i(request):
    if(request.user.is_authenticated):
        data = serializers.serialize('json', [request.user], fields['email', 'username'])
        return HttpResponse(data)
    else:
        return JsonResponse({'user':None})
