from app import app
from flask import request, jsonify
import requests
import json
import overpy

@app.route('/', methods=['GET'])
@app.route('/index')
def index():

	lat = request.args.get('lat')
	lon = request.args.get('lon')

	speed = calcSpeed(lat, lon)

	return jsonify(rec_speed=speed)

def calcSpeed(lat, lon, radius = 8e-5):
	params = {
		'apikey': 'HackPSU2017',
		'q': lat+","+lon
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

	app.logger.debug('Weather: %s', w)
	
	if w in ['rain', 'fog', 'rain', 'flurries', 'snow', 'freezing rain', 'heavy rain', 'light rain']:
		change = -5
	elif w in ['t-storms', 'sleet', 'rain and snow', 'ice']:
		change = -10
	else:
		change = 0


	result = overpy.Overpass().query('way(around:10,%s,%s)["maxspeed"]; (._;>;); out body; ' % (lat, lon))

	topspeed = None if len(result.ways) < 1 else result.ways[0].tags.get("maxspeed", "n/a")

	app.logger.debug('Speed Limit: %s', topspeed)

	if(topspeed):
		return str(int(topspeed.replace('mph','')) + change)
	else:
		return 'No Speed Data Available'
