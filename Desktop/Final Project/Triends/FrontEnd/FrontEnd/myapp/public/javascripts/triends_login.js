var socket = io();
var emailArray=[];
var passwordArray=[];

var loginBox = document.getElementById("login");
var regBox = document.getElementById("register");
var forgetBox = document.getElementById("forgot");

var loginTab = document.getElementById("loginTab");
var regTab = document.getElementById("registerTab");

const loginBtn = document.getElementById("SignUpBtn");
const forgotPW = document.getElementById("forgotPW");

// loginBtn.addEventListener("click", function(){
//     location.href = 'triends_main.html';
// })


function regTabFun(){
    event.preventDefault();

    regBox.style.visibility="visible";
    loginBox.style.visibility="hidden";
    forgetBox.style.visibility="hidden";

    regTab.style.backgroundColor="rgb(95,158,160)";
    loginTab.style.backgroundColor="rgb(80,130,160)";
}

function loginTabFun(){
    event.preventDefault();

    regBox.style.visibility="hidden";
    loginBox.style.visibility="visible";
    forgetBox.style.visibility="hidden";

    loginTab.style.backgroundColor="rgb(95,158,160)";
    regTab.style.backgroundColor="rgb(80,130,160)";
}

function forTabFun(){
    event.preventDefault();

    // regBox.style.visibility="hidden";
    loginBox.style.visibility="hidden";
    forgetBox.style.visibility="visible";

    regTab.style.backgroundColor="rgb(95,158,160)";
    loginTab.style.backgroundColor="rgb(80,130,160)";
}




function register(){
    event.preventDefault();
    var fullName = document.getElementById("RegisterFullname").value;
    var email = document.getElementById("RegisterEmail").value;
    var password = document.getElementById("RegisterPw").value;
    var passwordRetype = document.getElementById("RegisterConfPw").value;
    var genderMale = document.getElementById("male").value;
    var genderFemale = document.getElementById("female").value;

    if (email == ""){
        alert("Email required.");  
        return ;
    }
    else if(fullName == ""){
        alert("Full name required");
    }
    else if (password == ""){
        alert("Password required.");
        return ;
    }
    else if (passwordRetype == ""){
        alert("Password required.");
        return ;
    }
    else if ( password != passwordRetype ){
        alert("Password don't match retype your Password.");
        return;
    }
    else if(emailArray.indexOf(email) == -1){
        emailArray.push(email);
        passwordArray.push(password);

        alert(email + "  Thanks for registration. \nTry to login Now");

        document.getElementById("RegisterFullname").value ="";
        document.getElementById("RegisterEmail").value="";
        document.getElementById("RegisterPw").value="";
        document.getElementById("RegisterConfPw").value="";
    }
    else if(genderFemale==""||genderMale==""){
        alert("Gender required");
    }
    else{
        alert(email + " is already register.");
        return ;
    }
}

function forgotPassword(){
    event.preventDefault();

    var forgot = document.getElementById("forgot");
    forgot.style.visibility="visible";
    var email = document.getElementById("forgotEmail").value;

    if(emailArray.indexOf(email) == -1){
        if (email == ""){
            alert("Email required.");
            return ;
        }
        alert("Email does not exist.");
        return ;
    }

    alert("email is send to your email check it in 24hr. \n Thanks");
    document.getElementById("fe").value ="";
}

var loging_welcome = document.getElementById("loging_welcome");
var containter = document.getElementById("container");

