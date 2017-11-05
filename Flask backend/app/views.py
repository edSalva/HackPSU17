from app import app
import requests
import json

@app.route('/')
@app.route('/index')
def index():
	params = {
		'apikey': 'HackPSU2017',
		'q': '39.1434,-77.2014',
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
	
	if w == 'rain' or w== 'fog' or w == 't-storms' or w == 'rain' or w=='flurries' or w == 'snow' or w=='ice' or w=='sleet' or w=='freezing rain' or w=='rain and snow' or w=='heavy rain' or w=='light rain':
		return '-5';
	else:
		return '0'
