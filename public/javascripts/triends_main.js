
function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}
  
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}


// Get the modal
var modal_aboutTr = document.getElementById("modal_aboutTr");
var modal_setProf = document.getElementById("modal_setProf");
var modal_setPref = document.getElementById("modal_setPref");
var modal_findActv = document.getElementById("modal_findActv");
var modal_findActv = document.getElementById("modal_Alarm");

// Get the button that opens the modal
var link_aboutTr = document.getElementById("aboutTr");
var link_setProf = document.getElementById("SetProf");
var link_setPref = document.getElementById("SetPref");
var link_findActv = document.getElementById("FindAct");
var link_findActv = document.getElementById("Alarm");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close");

var modals = document.getElementsByClassName("modal");

// When the user clicks the button, open the modal 
function Link(Func) {
    if(Func=="AboutYou")
      modal_aboutTr.style.display = "block";
    else if(Func=="SetProfile")
      modal_setProf.style.display = "block";
    else if(Func=="SetPreference")
      modal_setPref.style.display = "block";
    else if(Func=="FindActivities")
      modal_findActv.style.display = "block";
    else if(Func=="Alarm")
      modal_Alarm.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
for (var i=0; i<span.length; i++){
  span[i].addEventListener('click', function(event){  
    event.target.parentElement.parentElement.parentElement.style.display = "none";
  })
}


// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal_aboutTr) {
    modal_aboutTr.style.display = "none";
  }
}

function readURL(input){
  
}


function LogOut(){
  convertPage("login")
}

function convertPage(page) {
  location.replace("triends_"+page+".html");
}

//Smoker[1].getAttribute("value")
function checked(smoker){
  var Smoker = document.getElementsByName("user_smoker");
  console.log(Smoker);
  if(Smoker[0].getAttribute("value")==smoker){
    Smoker[0].setAttribute("checked","checked");
  }
  else{
    Smoker[1].setAttribute("checked","checked");
  }
  console.log(Smoker[0]);

}
