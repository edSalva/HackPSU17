from app import app
from flask import request, jsonify
import requests
import json
import overpy
from math import exp

@app.route('/', methods=['GET'])
@app.route('/index')
def index():

	lat = request.args.get('lat')
	lon = request.args.get('lon')

	w, limit, speed = getLocData(lat, lon)

	brakes, gas = calcPedals(speed)

	return jsonify(weather=w, rec_speed=speed, speed_limit=limit, brake_data = brakes, gas_data = gas)

def getLocData(lat, lon):
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
		weather = 'rainy'
	elif w in ['t-storms', 'sleet', 'rain and snow', 'ice']:
		change = -10
		weather = 'snow'
	else:
		change = -0
		weather = 'sunny'


	result = overpy.Overpass().query('way(around:50,%s,%s)["maxspeed"]; (._;>;); out body; ' % (lat, lon))

	topspeed = None if len(result.ways) < 1 else result.ways[0].tags.get("maxspeed", "n/a")

	if topspeed: topspeed = topspeed.replace('mph','');

	app.logger.debug('Speed Limit: %s', topspeed)

	if(topspeed):
		rec_spd = int(topspeed) + change
	else:
		rec_spd = 'N/A'
		topspeed = 'N/A'
	
	return weather, topspeed, rec_spd

def calcPedals(speed, tf=10, ti = 0):

	MAXVAL = 100
	th = (tf - ti)*3/4
	brakes = []
	gas = []
	try:
		k = 60/float(speed)
		for t in (x * .01 for x in xrange(ti, tf*100)):
			brakes.append(MAXVAL/(1 + exp(-k*(t - th))))
			gas.append(MAXVAL*exp(-k*(t-1)))
	except Exception as e:
		app.logger.debug("Could not get brake/gas data, speed=%s", speed)
		app.logger.debug(e)

	return brakes, gas
