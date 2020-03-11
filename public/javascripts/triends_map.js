// //---------------------------------for main
// let latitude ;
// let longitude ;
// var socket = io.connect();
var socket = io();
mapboxgl.accessToken = 'pk.eyJ1IjoiamludG9uaWMiLCJhIjoiY2szb3FvajV3MW41dzNucXgxc3owZ3VyeSJ9.CNZPlS9uIjm-bGA9feF1eg';
var map;
var map_main = document.getElementById("map");

//To get latitude, longitude
const Position = (position)=> {
  latitude = position.coords.latitude; 
  longitude = position.coords.longitude;
  console.log("lat : " + latitude);
  console.log("long : " + longitude);

  try{
    initMap();
  }
  catch(err){
    document.getElementById("map").innerHTML = err;
  }
}

//Start map
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(Position);
  console.log("supported");
}

//Initialize map as your current location
function initMap(){
  map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v9',
    center: [longitude,  latitude], // starting position
    zoom: 10 // starting zoom
  });

  // Add geolocate control to the map.
  map.addControl(new mapboxgl.GeolocateControl({
    positionOptions: { enableHighAccuracy: true },
    trackUserLocation: true })
  );
}


function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showPosition, hidePosition);
	}else{ 
		alert("Geolocation is not supported by this browser. Now we trying to get your location through your IP address.");
		ipPosition();
	}
}

function showPosition(position) {
	pos = {
		lat: parseFloat(position.coords.latitude),
		lng: parseFloat(position.coords.longitude)
	};
}

function hidePosition(position) {
	alert('User denied the access of the position. Now we trying to get your location through your IP address.');
	ipPosition();
}

function ipPosition(){
  this.get("http://ipinfo.io", function (response) {
		var loc = response.loc.split(',');
		pos = {
			lat: parseFloat(loc[0]),
			lng: parseFloat(loc[1])
		};
	}, "jsonp");
}
getLocation();


var markers=[];
var getMarkerUniqueId = (lat, lng)=>{
  return lat + '_' + lng;
}

function addMarker(location){
  var markerID = getMarkerUniqueId(location.lat, location.lng);
  var marker = new mapboxgl.Marker({
    // position : location,
    // map : map,
    id : markerID
  }).setLngLat(location).addTo(map);
  console.log(marker);
  markers[markerID] = marker;
}

var removeMarker = function(marker, markerId) {
	marker.remove(); // set markers setMap to null to remove it from map
	delete markers[markerId]; // delete marker instance from markers object
};


check_position = setInterval(function(){ //create a loop and wait for the response
  if(typeof pos != 'undefined'){ //while the position is not defined the loop is checking every half seconds
    socket.emit('new_user', {pos: pos});
    clearInterval(check_position);
  }
}, 500);


  // socket.on('already', function(data){
	// 	this.each( data.visitors, function( key, pos ) {
  //     console.log("already function : " + data);
	// 		addMarker(pos);
	// 	});
  // });
  
  socket.on('connected', function(data){
    let users = Object.keys(data.users);
    console.log(users)
    console.log(data.users_count)
    
    // for(let i=0; i<data.users_count; i++){
    //   addMarker(posUsers);
    // }


    let posUsers = data.pos;

  });
  
  socket.on('disconnected', function(data){
    //we can now delete this position:
    console.log("disconnected function : " + data);
		var markerId = getMarkerUniqueId(data.del.lat, data.del.lng); // get marker id by using clicked point's coordinate
		var marker = markers[markerId]; // find marker
		removeMarker(marker, markerId); // remove it
	});
