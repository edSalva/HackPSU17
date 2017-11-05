// Your code goes here

var vinElem = document.getElementById('vin');
gm.info.getVehicleConfiguration(function(data) {
  vinElem.innerHTML = gm.info.getVIN();
});

var CurrentSpeedElem = document.getElementById('CurrentSpeed');
gm.info.getVehicleConfiguration(function(data) {
  CurrentSpeedElem.innerHTML = gm.system.getSpeed();
});
