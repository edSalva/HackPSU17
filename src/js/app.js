// Your code goes here
//

var url = "http://127.0.0.1:5000";
var reccomended_speed;

function showSpeed(data) {
	  console.log("Speed data: " + data);
		  var speed = data.average_speed;
			  if (speed !== undefined) {
					    document.getElementById('CurrentSpeed').innerHTML = speed;
				}
};

function getReccomend(position) {
	var lat = position.coords.latitude / 3600000;
	var lon = position.coords.longitude / 3600000;
	//var turn_offset = -1 * (Math.abs(gm.info.getVehicleData(false,'wheel_angle') / 100)  +  Math.abs(gm.info.getVehicleData(false, 'yaw_rate') / 20));
	
	document.getElementById('latitude').innerHTML = lat;
	document.getElementById('longitude').innerHTML = lon;

	var oReq = new XMLHttpRequest();
	oReq.addEventListener("load", 
			function(resp) {

				var data = JSON.parse(this.responseText);
				reccomended_speed = data['rec_speed']; 

				document.getElementById('IdealSpeed').innerHTML = reccomended_speed; //+turn_offset;
				document.getElementById('SpeedLimit').innerHTML = data['speed_limit']

				var weather = data['weather'];
				var wImg = document.getElementById('weatherImage');
				if(weather === 'sunny') {
					wImg.src = 'images/sunny.svg';
				}
				else if(weather === 'rainy') {
					wImg.src = 'images/rain.png';
				}
				else if(weather === 'snow') {
					wImg.src = 'images/snow.png';
				}
				//graph_data(false, data['brake_data']);
				//graph_data(true, data['gas_data']);
	});
			
	console.log(url + "/?lat=" + lat + "&lon=" + lon);
	oReq.open("GET", url + "/?lat=" + lat + "&lon=" + lon);
	oReq.send();
};

function updateTurn(data) {
	console.log(data);

	var turn_offset = -1 * (Math.abs(data.wheel_angle / 100)  +  Math.abs(data.yaw_rate / 20));
	var recText = document.getElementById('rec_speed');
	recText.innerHTML = turn_offset + reccomended_speed;
};

function graph_data(gas, data) {

	var dps = [];
	var chart = new CanvasJS.Chart(gas ? 'gas_container' : 'brk_container', {
		title :{
						 text: gas ? 'Acceleration' : 'Breaking'
					 },
			axisY :{
							 includeZero: false
						 },
			data: [{
							name: "Optimal Pattern",
							type: "line",
							dataPoints: opt_dps
						},
			{
				name: "User Pattern",
				type: "line",
				dataPoints: dps
			}]
	});

	console.log(chart);

	for(t = 0; t < 1000; t++) {
		opt_dps.push({
				x: t * 0.01,
				y: data[t]
			});
	}

	chart.render();

	t = 0;
	var updateChart = function() {
		var val = gm.info.getVehicleData(false, [gas ? 'accelerator_position' : 'brake_position']);
		dps.push({
			x: t,
			y: val
		});
		t += 0.01;
		chart.render();

		if(t >= 10) {
			clearInterval(interval);
		}
	}

	var interval = setInterval(updateChart(), 10);
}

gm.info.watchVehicleData(showSpeed, ['average_speed']);
gm.info.getVehicleData(showSpeed, ['average_speed']);

gm.info.watchPosition(getReccomend);
gm.info.getCurrentPosition(getReccomend);

gm.info.watchVehicleData(updateTurn, ['wheel_angle', 'yaw_rate']);
