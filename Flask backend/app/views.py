from app import app
from flask import request
import requests
import json

@app.route('/', methods=['GET'])
@app.route('/index')
def index():

	lat = request.args.get('lat')
	lon = request.args.get('lon')
	params = {
		'apikey': 'HackPSU2017',
		'q': ''+lat+','+ lon +'',
	}

	r = requests.get(
      'http://dataservice.accuweather.com/locations/v1/cities/geoposition/search',
      params=params).json()
	
	key = r['Key']
	
	#now have location key corresponding to a particular lat/lon
	
	params = {
		'apikey': 'HackPSU2017',	
	}
	
	r = requests.get(
      'http://dataservice.accuweather.com/currentconditions/v1/' + key,
      params=params).json()
	  
	w = r[0]['WeatherText'].lower()
	
	#list of texts: https://apidev.accuweather.com/developers/weatherIcons
	
	if w == 'rain' or w== 'fog'  or w == 'rain' or w=='flurries' or w == 'snow'  or w=='freezing rain' or w=='heavy rain' or w=='light rain':
		return '-5';
	elif w == 't-storms' or w=='sleet' or w=='rain and snow'  or w=='ice':
		return '-10'
	else:
		return '0'
