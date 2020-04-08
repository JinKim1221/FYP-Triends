
const express = require('express');
const router = express.Router();
const session = require('express-session');

/* Mongo DB */
const mongoose = require('mongoose');
const User = mongoose.model('users');

/* SESSION */
router.use(session({
  secret : 'secretCode',
  resave : false,
  saveUninitialized:true
})); 

/* GET home page. */
router.get('/', function(req, res) {
  
  if(req.session.email){
    res.redirect('/main');
  }
  else{
    res.render("triends_login",{
        title:'Find your travelmate!'
    });
  }
});

router.get('/login', function(req, res, next) {
  res.render("triends_login",{
    title:'Find your travelmate!'});
});

router.get('/register', function(req, res, next) {
  res.render("triends_register",{
    title:'Find your travelmate!'});
});

router.get('/main', function(req, res, next) {
  sessionEmail = req.session.email;
  
  // sessionStorage.setItem(sessionEmail)
  var user_fullname ;
  var userInfo = User.findOne({user_email:sessionEmail}, function(err, resp){
    if(req.session.email){
      res.render("triends_main",{
        title:'Find your travelmate!',
        users : resp
      });
    }
    else{
      res.render("triends_login",{
        title:'Find your travelmate!',
        users : resp
      });
    }
  });

});

router.get('/showUsers', function(req, res, next){


});


router.get('/logout', (req, res, next) => {
  
  req.session.destroy((err) => {
    if(err){
      res.negotiate(err);
    }
    else{
      res.redirect('/login');

    }
  });
});



router.post('/login_user',(req,res)=>{

  console.log(req.body);
  req.session.email = req.body.loginEmail;
  req.session.password = req.body.loginPw;
  FindUserInfo(req, res);
  
})

router.post('/register_user',(req,res)=>{
  insertUserInfo(req, res);
})


router.post('/settingProfile', function(req, res, next) {
  const sessionEmail = req.session.email;
  
  console.log(sessionEmail);
  var userInfo = User.findOne({user_email:sessionEmail}, function(err, resp){

    console.log(resp);
    if(!err && resp){
      resp.user_smoker = req.body.user_smoker;
      resp.user_kindness = req.body.user_kindness;
      resp.user_talkative = req.body.user_talkative;
      resp.user_outgoing = req.body.user_outgoing;
      resp.user_humerous = req.body.user_humerous;
      resp.user_active = req.body.user_active;
      resp.user_moreInfo = req.body.user_moreInfo;


      console.log("smoker :::::::::::::: " +  req.body.user_smoker);
      var userProfile = new User(resp);
      userProfile.save(function(err, resp_){
        if(!err) {
          console.log("no error defined" + resp_);
          res.redirect('/main');

        }
        else res.send("error found " + err);
      })
    }
    else res.send(err);

  });

});


router.post('/settingPreference', function(req, res, next) {
  const sessionEmail = req.session.email;
  
  console.log(sessionEmail);
  var userInfo = User.findOne({user_email:sessionEmail}, function(err, resp){
    
    if(!err && resp){
      resp.user_Pref_gender = req.body.user_Pref_gender;
      // resp.user_Pref_smoker = req.body.user_Pref_smoker;
      resp.user_Pref_smoker = req.body.user_Pref_smoker;
      resp.user_Pref_non_smoker = req.body.user_Pref_non_smoker;
      resp.user_Pref_kindness = req.body.user_Pref_kindness;
      resp.user_Pref_talkative = req.body.user_Pref_talkative;
      resp.user_Pref_outgoing = req.body.user_Pref_outgoing;
      resp.user_Pref_humerous = req.body.user_Pref_humerous;
      resp.user_Pref_active = req.body.user_Pref_active;
   
      var userProfile = new User(resp);
      userProfile.save(function(err, resp_){
        if(!err) {
          console.log("no error defined" + resp_);
          res.redirect('/main');
        }
        else res.send("error found " + err);
      })
    }
    else res.send(err);

  });
});



function insertUserInfo(req, res){
  console.log("this is insert user info");
  var users = new User();

  console.log(users);

  users.user_fullname = req.body.user_fullname;
  users.user_email = req.body.user_email;
  users.user_password = req.body.user_password;
  users.user_confPassword = req.body.user_confPw;
  users.user_gender = req.body.user_gender;

  console.log(req.body);


  users.save((err, doc)=>{
    
      var validUser = User.findOne({user_email:req.body.user_email}, function(err, resp){
        if(resp.user_email==req.body.user_email){
          req.body.user_emailError = "Email already exists!";
          // handleValidationError(err, req.body);
          res.render('triends_register',{
            title:'Find your travelmate!',
            users : req.body
          });
        }    
      });

      if(req.body.user_password != req.body.user_confPw){
        req.body.user_confPasswordError =  "Password does not match";
        // handleValidationError(err, req.body);
        res.render('triends_register',{
          title:'Find your travelmate!',
          users : req.body
        });
        if(req.body.user_gender==""){
          req.body.user_confPasswordError =  "Please select your gender";
        }
      }
      else{
        console.log("You Signed Up Successfully");
        res.redirect('/login');
      }
  })

}

function FindUserInfo(req, res){
  let loginEmail= req.body.loginEmail;
  let loginPw = req.body.loginPw;


  var validUser = User.findOne({user_email:req.body.loginEmail, user_password:req.body.loginPw}, function(err, resp){
    if(resp.user_email==loginEmail&& resp.user_password == loginPw){
      console.log("Log in successful!");
      // handleValidationError(err, req.body);
      res.redirect('/main');
    }
    else if(resp.user_email!=loginEmail && resp.user_password != loginPw){
      req.body.user_invalidAccountError = "Invalid email or password. Try again";
      console.log("Please try again");
      // res.render('triends_main',{
      //   title:'Find your travelmate!',
      //   users : req.body
      // });
    }    
  });
}

function handleValidationError(err, body){
  for(field in err.errors){
    console.log(field);
    switch(err.errors[field].path){
      case 'user_fullname':
        body['user_fullnameError']=err.errors[field].message;
        break;
      case 'user_email':
        body['user_emailError']=err.errors[field].message;
        break;
      case 'user_password':
        body['user_passwordError']=err.errors[field].message;
        break;
      case 'user_confPassword':
        body['user_confPasswordError']=err.errors[field].message;
        break;
      case 'user_gender':
        body['user_genderError']=err.errors[field].message;
        break;
    }
  }
}

module.exports = router;