var socket = io();

mapboxgl.accessToken = 'pk.eyJ1IjoiamludG9uaWMiLCJhIjoiY2szb3FvajV3MW41dzNucXgxc3owZ3VyeSJ9.CNZPlS9uIjm-bGA9feF1eg';
var map;
var map_main = document.getElementById("map");
var userList = document.getElementById("onlineUsers");

var loginForm = document.getElementById("loginForm");
var userEmail = document.getElementById("loginEmail"); //unique email
var username = document.getElementById("navMenu");

function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(Position);
	}else{ 
		alert("Geolocation is not supported by this browser. Now we trying to get your location through your IP address.");
	}
}


function Position(position) {
	pos = {
		lat: parseFloat(position.coords.latitude),
		lng: parseFloat(position.coords.longitude)
  };

  if(window.location.pathname=="/login"){
    console.log("log in page")
  }
  else{
    try{
      initMap();
    }
    catch(err){
      document.getElementById("map").innerHTML = err;
    }
  }
}getLocation();


//Initialize map as your current location
function initMap(){
  map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v9',
    center: [pos.lng,  pos.lat], // starting position
    zoom: 17 // starting zoom
  });

  // Add geolocate control to the map.
  map.addControl(new mapboxgl.GeolocateControl({
    // positionOptions: { enableHighAccuracy: true },
    trackUserLocation: true })
  );
}

var markers=[];
var getMarkerUniqueId = (email)=>{
  return email;
}

function addMarker(location, email){
  var markerID = email;
  
  if(window.location.pathname != "/login"){
    if(email in markers){

    }
    else{
      
      // Create a popup, but don't add it to the map yet.
      popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
        '<strong>Profile</strong>' +
        '<p> <strong>' + username + '</strong> is ' + gender + ' and ' + smoker +'.' 
        +'<br> Kindness is '+ kindness +' out of 5 ;'
        +'<br> Talkative is '+ talkative +' out of 5;'
        +'<br> Outgoing is ' + outgoing + ' out of 5;'
        +'<br> Humerous is ' + humerous + ' out of 5;'
        +'<br> Active is '+ active +' out of 5;'
        +'<br> last comment is '+ moreInfo +' </p>'
        +'<input id="sendMessage" type="button" value="Send message" onclick="openChat(\''+username+'\') "></input>'
      );
      markerArr = [];
      // var markerDIV = document.createElement('div').setAttribute('id', email);
      marker = new mapboxgl.Marker({
        id : email
      }).setLngLat(location).setPopup(popup).addTo(map);
      markers[markerID] = marker;
      markerArr.push(marker);
    }

  }
}


var removeMarker = function(marker, markerId) {  
  if(window.location.pathname != "/login"){
    marker.remove(); // set markers setMap to null to remove it from map
    delete markers[markerId]; // delete marker instance from markers object
  }
};

check_position = setInterval(function(){ //create a loop and wait for the response
  if(typeof pos != 'undefined'){ //while the position is not defined the loop is checking every half seconds
    socket.emit('new user', {pos:pos}, function(data){

    });
    clearInterval(check_position);
  }
}, 500);


socket.on('connected', function(data){
  
  noUsers =  Object.keys(data.userInfo).length;
  
  
  for(let i=0; i< noUsers; i++){
    
    useremail =  Object.keys(data.userInfo)[i];
    username = Object.values(data.userInfo)[i].fullname;
    gender = Object.values(data.userInfo)[i].gender;
    smoker = Object.values(data.userInfo)[i].smoker;
    kindness = Object.values(data.userInfo)[i].kindness;
    talkative = Object.values(data.userInfo)[i].talkative;
    outgoing = Object.values(data.userInfo)[i].outgoing;
    humerous = Object.values(data.userInfo)[i].humerous;
    active = Object.values(data.userInfo)[i].active;
    moreInfo = Object.values(data.userInfo)[i].moreInfo;
    user_position = Object.values(data.userInfo)[i].pos;
    
    socket.useremail = useremail;
    users[socket.useremail] = socket;

    addMarker(user_position, useremail);
  }

  for(let i=0; i<Object.keys(markers).length; i++){
    Object.values(markers)[i]._element.addEventListener('click', function(e){
      console.log('Clicked marker : '+Object.keys(markers)[i]);
      ToUseremail = Object.keys(markers)[i];
    })
  }
});



var chat = document.getElementById('chat');
var chatRoom= document.getElementById("chat-room");

var singleMsg_Div = document.getElementById("singleMsg");
var Single_messageForm = document.getElementById("send-A-message");
var send_A_message_Btn = document.getElementById("send_A_message_Btn");
var A_message = document.getElementById("A_message");

var messageForm = document.getElementById("send-message");
var sendBtn = document.getElementById("sendBtn");
var message = document.getElementById("message");

var usernameDiv = document.getElementById("username");
var chatListUl = document.getElementById('chatListUl');
var chatListDiv = document.getElementById('chatListDiv');
var p1 = document.createElement('p');
var p2 = document.createElement('p');
var notifyBdg = document.getElementById("badge");
var modal_alarm = document.getElementById("modal_Alarm");
var backToList = document.getElementById("backToList");
var activities = document.getElementById("activities");

function openChat(to_username){
  modal_alarm.style.display = 'block';
  usernameDiv.innerHTML = "<b> To " + to_username + "</b>";
}


froms = [];
user_emails = [];

if(window.location.pathname=="/login"){
  console.log("log in page")
}
else{
  
  socket.on('update chatList', function(data){ 
    rooms = data.rooms;
    roomname = data.roomname;
    var date = new Date();
    day_month = date.getDate() + "th " + date.getMonth();
    time = date.getHours() +" : "+date.getMinutes();
    
    // IF DATA.FROM IS NOT IN THE ARRAY CALLED FROMS
    if(froms.indexOf(data.toEmail) == -1 ){   
      user_emails.push(data.toEmail);
      chatListUl.append(p2);
      p2.innerHTML += '<a id="\''+data.toEmail+'\'" href=# class="list-group-item list-group-item-action" onclick=switchRoom(\''+ roomname +'\',\''+ data.toEmail +'\',\''+ data.to +'\',\''+ data.message +'\')>'+
                      ' <b> '+ data.to + '</b> <br>'+
                      ' <small>' + data.message + '  </small> <br>'+
                      ' <small>received  ' + time + '  </small></a> ';
      froms.push(data.toEmail);
    }
    console.log(froms);
  });
  
  Single_messageForm.addEventListener('submit', function(e){
    e.preventDefault;
    // modal_alarm.modal(KeyboardEvent);
    if(A_message.value==""){

    }else{
      console.log("when you clicked send message button ;");
      socket.emit('send message', {message: A_message.value, to : ToUseremail});
    }
    A_message.value='';
  });

  //#region comment
  // function replyBack(email){ 
  //   // console.log("to reply : " + replyTo)
  //   chat.style.display='block';
  //   messageForm.addEventListener('submit', function(e){
  //     e.preventDefault;
  //     // modal_alarm.modal(KeyboardEvent);
  //     if(message.value==""){
  
  //     }else{
  //         console.log("in replyBack() ; " + socket.useremail);
  //         socket.emit('send message', {message: message.value, to : email});
  //     }
  //     message.value='';
  //     chatRoom.innerHTML = "";
  //   });
  // };
  // socket.on('load saved messages', function (docs) {
  //     for(var i=0; i<docs.length; i++){
  //         displayMsg(docs[i]);
  //     }
  // });

  // socket.on('new message', function (data) {
  //   displayMsg(data)
  // });

  // function displayMsg(data) {
    
  //   chatRoom.innerHTML =
  //   '<div class="media">'+
  //       '<a class="pull-left" href="#">'+
  //         '<img class="media-object img-circle " src="img/user.png" />'+
  //       '</a>'+
  //       '<div class="media-body" >'+
  //       '<small class="text-muted">' +
  //       data.FromUsername + '<br />'+
  //       '</small>'+
  //         // '<small class="text-muted">' +
  //       data.msg+
  //       '<hr />'+
  //     '</div>'+
  //   '</div>';
  //   chatRoom.appendChild(chatRoom);
     
  // }

  // socket.on('Update Chat', function (username, data) {
  //   console.log("Update Chat : " + username +" / "+data);
  // });

  // socket.on('Update Rooms', function(rooms, current_room) {
    
  //   rooms.forEach((key, value)=>{
  //       if(rooms[value] == current_room){
  //         chatListDiv.innerHTML = '<div style="width:100px; margin-bottom: 10px"   class="btn btn-success">' + rooms[value] + '</div>' ;
  //       }
  //       else {
  //         chatListDiv.innerHTML = '<div><a href="#"  class="btn btn-success"  style="width:100px; margin-bottom: 10px" onclick="switchRoom(\''+rooms[value]+'\')">' + rooms[value] + '</a></div>'
  //       }
  //   });
  // });
//#endregion
  
var to_email, to_name;
  function switchRoom(room, email, name, message){
    chatListDiv.style.display='none';
    chat.style.display='block';
    backToList.style.display='block';

    // chatRoom = "";
    console.log("room : " + room);
    console.log("email : " + email);
    console.log("message : " + message);
    to_email = email;
    to_name = name;
    socket.emit('switchRoom', room, email, message);
  }
  
  messageForm.addEventListener('submit', function(e){
    e.preventDefault;
    // modal_alarm.modal(KeyboardEvent);
    if(message.value==""){
      //do nothing
    }
    else{
      console.log("when you clicked send message button ;");
      socket.emit('send message', {message: message.value, to : to_email});
    }
    message.value='';
  });

  backToList.addEventListener('click',function(){ 
    chatListDiv.style.display='block';
    chat.style.display='none';
  });


  socket.on('new message', function(data){
    rooms = [];

    var p1 = document.createElement('p');
    chatRoom.append(p1);
    p1.innerHTML += '<b>'+ data.FromUsername + ':</b> ' + data.msg + '<br>';   
    p1="";
  });


  socket.on('send notification', function(){
    notifyBdg.style.display='block';
  });

  socket.on('get attractions', function(data){
    noPlaces =  Object.keys(data.places).length;
    console.log(noPlaces)
  
    for(let i=0; i< noPlaces; i++){
      var listEle = document.createElement('li');
      var imgURL;

      place_id = Object.values(data.places)[i].place_id;
      place_name = Object.values(data.places)[i].place_name;
      place_photo = Object.values(data.places)[i].place_photo; 
      if(typeof place_name == 'undefined' || typeof place_photo == 'undefined'){
        // console.log("-----------------"+i+"------------------");
        // console.log("place_name : " + place_name);
        // console.log("place_photo : " + place_photo);
        // console.log("----------------------------------------");
      }
      else{
        place_address = Object.values(data.places)[i].place_address; // object
        place_offerGroup = Object.values(data.places)[i].place_offerGroup; // object
        // place_openNow = Object.values(data)[i].place_openNow;
        
        // console.log("-----------------"+i+"------------------");
        // console.log("place_name : " + place_name);
        // console.log("place_photo : " + place_photo);
        // console.log("----------------------------------------");

        imgURL = place_photo.images.thumbnail.url;
        if(place_address.street1 == null){
          place_address.street1 = "";
        }
        if(place_address.street2 == null){
          place_address.street2 = "";
        }
        if(typeof place_offerGroup == 'undefined'){
          price = "Not defined yet";
        }
        else{
          price = place_offerGroup.lowest_price;
        }

        address = place_address.street1 + " " + place_address.street2 + " " + place_address.city;
        
        activities.appendChild(listEle);
        listEle.innerHTML += '<img src='+imgURL+' style="float:left; border-radius: 5px; ">' + 
                             '<div> <b><h4> '+place_name+'</b></h4>'+
                             '<p>'+ address+'</p>' +
                             '<p>lowest price : '+ price +'</p></div>';
        
      } 
    }
    

    // listEle.innerHTML = Object.values(data.places);
    // activities.append(listEle);
  })
  
  socket.on('disconnected', function(data){
    console.log(" remove marker by disconnecting ");
    var marker = markers[data.email]; // find marker
    removeMarker(marker, data.email); // remove it
  });

}