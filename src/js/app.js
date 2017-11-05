// Your code goes here
//

var url = "http://127.0.0.1:5000";

function showSpeed(data) {
	  console.log(data);
		  var speed = data.average_speed;
			  if (speed !== undefined) {
					    var speedText = document.getElementById('speed');
							    speedText.innerHTML = speed;
									}
};

function getReccomend(position) {
	console.log(position);

	var lat = position.coords.latitude / 3600000;
	var lon = position.coords.longitude / 3600000;

	var oReq = new XMLHttpRequest();
	oReq.addEventListener("load", 
			function(resp) {
		var recText = document.getElementById('rec_speed');
		recText.innerHTML = JSON.parse(this.responseText)['rec_speed'];
			});

	console.log(url + "/?lat=" + lat + "&lon=" + lon);
	oReq.open("GET", url + "/?lat=" + lat + "&lon=" + lon);
	oReq.send();
}

gm.info.watchVehicleData(showSpeed, ['average_speed']);
gm.info.getVehicleData(showSpeed, ['average_speed']);

gm.info.watchPosition(getReccomend);
gm.info.getCurrentPosition(getReccomend);
