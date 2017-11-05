// Your code goes here

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

	var lat = pos.coords.latitude;
	var lon = pos.coords.longitude;

	var oReq = new XMLHttpRequest();
	oReq.addEventListener("load", 
			function(resp) {
		var recText = document.getElementById('rec_speed');
		recText.innerHTML = this.responseText;
			});

	oReq.open("GET", url );//+ "/?lat=" + lot + "&lon=" + lon);
	oReq.send();
}

gm.info.watchVehicleData(showSpeed, ['average_speed']);
gm.info.getVehicleData(showSpeed, ['average_speed']);

gm.info.watchPosition(getReccomend);
gm.info.getCurrentPosition(getReccomend);
