var express = require('express');
var router = express.Router();
//#region /* Mongo DB */
require('./database/mongodb');
const mongoose = require('mongoose');
const User = mongoose.model('users');
//#endregion

/* GET home page. */
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'YouStar' });
});

/* GET LOGIN PAGE. */
router.get('/login', function(req, res, next) {
  res.render('login',{
    title:'YouStar'});
});

/* USER SEND REGISTER INFO TO SERVER. */
router.post('/register_user',(req,res)=>{
  insertUserInfo(req, res);
})


function xinsertUserInfo(req, res){
  console.log("this is insert user info");
  var users = new User();
  users.user_fullname = req.body.user_fullname;
  users.user_email = req.body.user_email;
  users.user_password = req.body.user_password;
  users.user_confPassword = req.body.user_confPw;

  emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
  console.log(req.body.user_password);
  console.log(req.body.user_confPw);
  if(emailRegex.test( req.body.user_email))
  {
   console.log("email ok")
  }
  else{
    req.body.user_emailError = "Invalid Email!";
    return res.render('register',{
      
      title:'YouStar',
      users : req.body
    });
  }
  if(req.body.user_password.length < 8 ){
    req.body.user_confPasswordError =  "Password must be more than 8 characters";
    return res.render('register',{
      
      title:'YouStar',
      users : req.body
    });
  }
  else if( req.body.user_password.length < 8){
    req.body.user_confPasswordError =  "Password does not match";
    return res.render('register',{
      
      title:'YouStar',
      users : req.body
    });
  }
  else if(req.body.user_password != req.body.user_confPw){
    req.body.user_confPasswordError =  "Password does not match";
    return res.render('register',{
      
      title:'YouStar',
      users : req.body
    });
  }


  console.log(req.body);
  var user = User.findOne({user_email:req.body.user_email}, function(err, resp){
    console.log("hereee!");
    console.log(resp)
    if(resp == null){
      console.log("save data");      
      return users.save((err, doc)=>{     
                console.log("You Signed Up Successfully");
                res.redirect('/login');
              });
    }
    if(user && resp.user_password == req.body.user_password ){
      req.body.user_emailError = "Email already exists!";
      // handleValidationError(err, req.body);
      console.log("should be here!!");  
      return res.render('register',{
        title:'YouStar',
        users : req.body
      });
    }
    else if(user){
      req.body.user_emailError = "Email already exists!";
      // handleValidationError(err, req.body);
      return res.render('register',{
      
        title:'YouStar',
        users : req.body
      });
    }
  });

}

module.exports = router;
