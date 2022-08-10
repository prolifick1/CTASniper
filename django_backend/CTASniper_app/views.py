from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.core import serializers
from django.contrib.auth import authenticate, login, logout
from .models import AppUser as User
from rest_framework.decorators import api_view
import requests
import json
from dotenv import load_dotenv
import os
#import googlemaps
from datetime import datetime

load_dotenv()
CTA_API_KEY=os.environ['CTA_API_KEY']
PLACES_API_KEY=os.environ['PLACES_API_KEY']


#gmaps = googlemaps.Client(key=PLACES_API_KEY)
#
#now = datetime.now()
#directions_result = gmaps.directions('125 S Clark St, Chicago, Il', '130 S Clark St, Chicago, Il',
#        mode='walking',
#        departure_time=now)
#print(directions_result)

# change csrf restrictions for unauthenticated users with api_view decorators
def homepage(request):
    print('homepage')
    index = open('static/index.html').read()
    return HttpResponse(index)

@api_view(['GET'])
def get_place(request):
    print(dir(request))
    user_input = request.query_params['query']
    places_url = f'https://maps.googleapis.com/maps/api/place/textsearch/json?' 
    payload={}
    headers = {}
    response = requests.request("GET", places_url, params={ 'query': user_input, 'key': PLACES_API_KEY }, headers=headers, data=payload)
    response_json = response.json()
    return JsonResponse(response_json)

@api_view(['GET'])
def get_stations(request):
    print(dir(request))
    stations_url = f'https://data.cityofchicago.org/resource/8pix-ypme.json' 
    response = requests.request("GET", stations_url)
    response_json = response.json()
    return JsonResponse(response_json, safe=False)

@api_view(['GET'])
def get_train_data(request):
    r = requests.get(f'http://lapi.transitchicago.com/api/1.0/ttarrivals.aspx?key={CTA_API_KEY}&max=10&mapid=40070&outputType=JSON')
    response_json = r.json()
    return JsonResponse(response_json)

@api_view(['GET'])
def calculate_walk(request):
    print(dir(request))
    originCoords = json.loads(request.query_params['originCoords'])
    destinationCoords = json.loads(request.query_params['destinationCoords'])
    response = requests.get(f'https://maps.googleapis.com/maps/api/directions/json?mode=walking&origin={originCoords["lat"]},{originCoords["lng"]}&destination={destinationCoords["lat"]},{destinationCoords["lng"]}&key={PLACES_API_KEY}')
    response_json = response.json()
    return JsonResponse(response_json)

@api_view(['POST'])
def sign_up(request):
    try:
        User.objects.create_user(username=request.data['email'], password=request.data['password'], email=request.data['email'])
    except Exception as e:
        print(str(e))
    return HttpResponse('hi')

    

@api_view(['POST'])
def log_in(request):
    print(dir(request))
    print(dir(request._request))

    # DRF assumes that the body is JSON, and automatically parses it into a dictionary at request.data
    email = request.data['email']
    password = request.data['password']
    # user = authenticate(username=email, password=password, email=email)
    user = authenticate(username=email, password=password)
    print('user?')
    print(user.email)
    print(user.password)
    if user is not None:
        if user.is_active:
            try:
                # access the base request, not the DRF request
                # this starts a login session for this user
                login(request._request, user)
            except Exception as e:
                print('except')
                print(str(e))
            return HttpResponse('success!')
            # Redirect to a success page.
        else:
            return HttpResponse('not active!')
            # Return a 'disabled account' error message
    else:
        return HttpResponse('no user!')
        # Return an 'invalid login' error message.


@api_view(['POST'])
def log_out(request):
    logout(request)
    return JsonResponse({'success':True})

@api_view(['GET'])
def who_am_i(request):
    # Make sure that you don't send sensitive information to the client, such as password hashes
    # raise Exception('oops')
    if request.user.is_authenticated:
        data = serializers.serialize("json", [request.user], fields=['email', 'username'])

        return HttpResponse(data)
    else:
        return JsonResponse({'user':None})
