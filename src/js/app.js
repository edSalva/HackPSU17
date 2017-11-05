// Your code goes here
//

var url = "http://127.0.0.1:5000";

function showSpeed(data) {
	  console.log("Speed data: " + data);
		  var speed = data.average_speed;
			  if (speed !== undefined) {
					    var speedText = document.getElementById('speed');
							    speedText.innerHTML = speed;
									}
};

function getReccomend(position) {
	var lat = position.coords.latitude / 3600000;
	var lon = position.coords.longitude / 3600000;

	var oReq = new XMLHttpRequest();
	oReq.addEventListener("load", 
			function(resp) {

				var data = JSON.parse(this.responseText);
				var recText = document.getElementById('rec_speed');
				recText.innerHTML = data['rec_speed'];
			
var canvas = document.getElementById('brk_canvas'),
context = canvas.getContext('2d');
var stats = data['brake_data'], left = 0,
			prev_stat = stats[0],
			move_left_by = 100, 
				width = canvas.width = 800,
				height = canvas.height = 400;

	context.translate(0, height);
	context.scale(1, -1);

	context.fillStyle = '#f6f6f6';
	context.fillRect(0, 0, width, height);
for(stat in stats) {
		the_stat = stats[stat];

			context.beginPath();
				context.moveTo(left, prev_stat);
					context.lineTo(left+move_left_by, the_stat);
						context.lineWidth = 5;
							context.lineCap = 'round';
							/*
							 * 	if(the_stat < stats[stat-1]) {
							 * 			context.strokeStyle = '#c0392b';
							 * 				} else {
							 * 						context.strokeStyle = '#3b3b3b';
							 * 							}
							 * 								*/
								context.stroke();

									prev_stat = the_stat;
										left += move_left_by;

}

canvas = document.getElementById('gas_canvas'),
		context = canvas.getContext('2d');
stats = data['gas_data'], left = 0,
			prev_stat = stats[0],
			move_left_by = 100, 
					width = canvas.width = 800,
							height = canvas.height = 400;

context.translate(0, height);
context.scale(1, -1);

context.fillStyle = '#f6f6f6';
context.fillRect(0, 0, width, height);

for(stat in stats) {
		the_stat = stats[stat];

			context.beginPath();
				context.moveTo(left, prev_stat);
					context.lineTo(left+move_left_by, the_stat);
						context.lineWidth = 5;
							context.lineCap = 'round';
							/*
							 * 	if(the_stat < stats[stat-1]) {
							 * 			context.strokeStyle = '#c0392b';
							 * 				} else {
							 * 						context.strokeStyle = '#3b3b3b';
							 * 							}
							 * 								*/
								context.stroke();

									prev_stat = the_stat;
										left += move_left_by;

}});

	console.log(url + "/?lat=" + lat + "&lon=" + lon);
	oReq.open("GET", url + "/?lat=" + lat + "&lon=" + lon);
	oReq.send();
}

gm.info.watchVehicleData(showSpeed, ['average_speed']);
gm.info.getVehicleData(showSpeed, ['average_speed']);

gm.info.watchPosition(getReccomend);
gm.info.getCurrentPosition(getReccomend);


