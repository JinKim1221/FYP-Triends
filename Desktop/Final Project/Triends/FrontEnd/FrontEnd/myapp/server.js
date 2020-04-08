
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var path = require('path');
var createError = require('http-errors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var request = require("request");
// var process= requrie('process');

//#region /* Mongo DB */
require('./models/mongodb');
const mongoose = require('mongoose');
const User = mongoose.model('users');
const Chat = mongoose.model('messages');
//#endregion

//#region /* SESSION */
const session = require('express-session');
var sess ;
app.use(session({
  secret : 'secretCode',
  resave : false,
  saveUninitialized: true
})); 
//#endregion

const hostname = '127.0.0.1';
const port = 3000;

var userInfo = {};
var userPreference = {};
var users = {};
var ToUsernames = [];  
var rooms = {};

var email, username, gender, smoker, kindness, talkative, outgoing, humerous, active, moreInfo;

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// set the default views folder
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


// register the bodyParser middleware for processing forms
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


server.listen(port,  hostname || process.env.IP, () => console.log(`The app listening on port at http://${hostname}:${port}/ `))
console.log("qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq"+ process.env.HOST);
var rooms = ['RoomForAll'];
io.sockets.on('connection', function(socket){

  // Chat.find({}, function(err, docs){
  //   if(err) throw err;
  //   socket.emit('load saved messages', docs);
  // })

  //CLIENT REQUEST TO SERVER
  socket.on('new user', function(posData, callback){
      
      //#region TripAdvisor API
      var options = {
        method: 'GET',
        url: 'https://tripadvisor1.p.rapidapi.com/attractions/list-by-latlng',
        qs: {
          lunit: 'km',
          currency: 'EUR',
          limit: '20',
          distance: '4',
          lang: 'en_US',
          longitude: Object.values(posData)[0].lng,
          latitude:  Object.values(posData)[0].lat
        },
        headers: {
          'x-rapidapi-host': 'tripadvisor1.p.rapidapi.com',
          'x-rapidapi-key': '429fdfdefdmshe4d5b834fa314c6p11561djsn18edefeca50d'
        }
      };
      var jsonBody, places ={};
      // request(options, function (error, response, body) {
      //   if (error) throw console.log(error);

      //   console.log("----------------------------------------\n");
      //   console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      //   jsonBody = JSON.parse(body);
      //   console.log(body);
      //           data = Object.values(jsonBody.data);
      //   console.log(options.qs.limit);
        
        
      //   no_places = options.qs.limit;
      //   for(let i=0; i<no_places; i++){
      //       places[i] ={
      //                 place_id : Object.values(data)[i].location_id,// location_id
      //                 place_name : Object.values(data)[i].name,
      //                 place_photo : Object.values(data)[i].photo,// photo 
      //                 place_address : Object.values(data)[i].address_obj,// address_obj
      //                 place_offerGroup : Object.values(data)[i].offer_group,// offer_group
      //             };
      //   }
      //   socket.emit('get attractions', {places : places});
      // });
      //#endregion
      
      socket.useremail = email; 
      userInfo[socket.useremail] = {
        fullname : username,
        gender : gender,
        smoker : smoker,
        kindness : kindness,
        talkative : talkative,
        outgoing : outgoing,
        humerous : humerous,
        active : active,
        moreInfo : moreInfo,
        pos : posData.pos
      };

      users[socket.useremail] = socket;
      
      socket.room = 'RoomForAll';
      socket.join('RoomForAll');

      // socket.emit('Update Chat', 'SERVER', 'you have connected to RoomForAll');
      // socket.broadcast.to('RoomForAll').emit('Update Chat', 'SERVER', userInfo[socket.useremail].fullname + ' has connected to this room');
      // socket.emit('Update Rooms', rooms, 'RoomForAll');
      
      //if you did not set the preference
      var no_userPref = Object.keys(userPreference);
      
      if(Object.keys(userPreference).length == 0){
        ConnectedUsers(userInfo);
      }
      else{//if you set the preference
        for(let i=0; i < no_userPref.length; i++)
        {
          if(no_userPref[i] in userInfo)
          {
            Preferred_users = {};
            Preferred_users[no_userPref[i]] = userInfo[no_userPref[i]];

            console.log("this is preferred users : " + Object.keys(Preferred_users));
            console.log("this is attributes of pref_users : " + Object.values(userInfo[no_userPref[i]]));
            
            ConnectedUsers(Preferred_users); 
          }
          else{
            console.log(no_userPref[i] +" is not in "+ Object.keys(userInfo));
            ConnectedUsers(userInfo);
          }
        }
      }      

      console.log('someone CONNECTED:' + Object.keys(userInfo));

  });
  
  function ConnectedUsers(userInfo){
    console.log("in connected users func " + Object.keys(userInfo));
    io.sockets.emit('connected', {userInfo : userInfo, currentUser : socket.useremail});
  }


  //SEND MESSAGE
  socket.on("send message", function(data){
    
    socket.leave(socket.room);
    from = socket.useremail;
    roomname = data.to + '_' + from;
    socket.room = roomname;
    message = { 
                to : userInfo[data.to].fullname,
                from : userInfo[from].fullname,
                msg : data.message
              };
    rooms.push(roomname);

    // var message_ = new Chat();
    // message_.sender = message.from;
    // message_.msg = message.msg;
    // message_.receiver = message.to;

    // message_.save((err, doc)=>{
    //   if(err) console.log(err)
    //   console.log(doc);
    // });
    
    console.log(data.to);
    console.log(message);
    socket.join(roomname);

    socket.emit('update chatList', {
                                              rooms : rooms,
                                              roomname : socket.room,
                                              message : data.message,
                                              to : userInfo[data.to].fullname,
                                              from : userInfo[from].fullname,
                                              toEmail : data.to,
                                              fromEmail : from
                                   });
                                   
    users[data.to].emit('send notification');
    users[data.to].emit('update chatList', {
                                              rooms : rooms,
                                              roomname : socket.room,
                                              message : data.message,
                                              to : userInfo[from].fullname,
                                              from : userInfo[data.to].fullname,
                                              toEmail : from,
                                              fromEmail : data
                                           });
                                           
    // socket.emit('new message', {msg: data.message, FromUsername : userInfo[socket.useremail].fullname});
    
      socket.emit('new message', {room : roomname, msg: data.message, FromUsername : userInfo[socket.useremail].fullname});
    if(from!=data.to){
      users[data.to].emit('new message', {room : roomname, msg: data.message, FromUsername : userInfo[socket.useremail].fullname});
    }

  });


    socket.on('switchRoom', function(newroom, email, message){
      socket.leave(socket.room);
      socket.join(newroom);
      console.log(newroom);
      // io.to(newroom).emit('new message', {room : newroom, msg: message, FromUsername : userInfo[socket.useremail].fullname});
      
      
      // socket.emit('Update Chat', 'SERVER', 'you have connected to '+ newroom );
      // sent message to OLD room
      // socket.broadcast.to(socket.room).emit('Update Chat', 'SERVER', socket.nickname+' has left this room');
      // update socket session room title
      socket.room = newroom;

      // socket.broadcast.to(newroom).emit('Update Chat', 'SERVER', socket.nickname+' has joined this room');
      // socket.emit('Update Rooms', rooms, newroom);

      //notification works
      
      // //send message to users
      // if(data.to == from){
      //   socket.emit('new message',{ msg : data.message, FromUsername : " TO YOURSELF"});
      // }
      // else{
      //   users[data.to].emit('new message',{ msg : data.message, FromUsername : userInfo[socket.useremail].fullname });
      //   socket.emit('new message',{ msg : data.message, FromUsername : "YOU" });
      // }

    });



  //DISCONNECT TO SERVER
  socket.on("disconnect", function(data){
    
    if(!socket.useremail) return;
    if(socket.useremail){
      io.sockets.emit('disconnected', { email : socket.useremail}); 	
      
      delete users[socket.useremail];
      delete userInfo[socket.useremail];
    }
  });
  
});


/* GET INITIAL PAGE. */
app.get('/', function(req, res) {
  // IF SESSION.EMAIL EXISTS
  if(req.session.email){
    res.redirect('/main');
  }
  else{ // IF SESSION.EMAIL DOES NOT EXIST
    res.redirect('/login');
  }
});

/* GET LOGIN PAGE. */
app.get('/login', function(req, res, next) {
  res.render("triends_login",{
    title:'Find your travelmate!'});
});


/* USER SEND LOGIN INFO TO SERVER. */
app.post('/login_user',(req,res)=>{
  console.log(req.body);
  req.session.email = req.body.loginEmail;
  req.session.password = req.body.loginPw;

  FindUserInfo(req, res); 
})

/* GET REGISTER PAGE. */
app.get('/register', function(req, res, next) {
  res.render("triends_register",{
    title:'Find your travelmate!'});
});


/* USER SEND REGISTER INFO TO SERVER. */
app.post('/register_user',(req,res)=>{
  insertUserInfo(req, res);
})

/* GET MAIN PAGE. */
app.get('/main', function(req, res, next) {
  sessionEmail = req.session.email;

  if(req.session.email) {
    var userInfo = User.findOne({user_email:sessionEmail}, function(err, resp){
      if(req.session.email){
        console.log(sessionEmail + " is online? "+ resp.user_online);
        

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
  }else{
    res.send('<p> Please Login First<p> <a href="/login"> Back to login </a>');
  }
});


/* GET LOGOUT PAGE. => DIRECT TO INIT PAGE */
app.get('/logout', (req, res, next) => {
  User.findOne({user_email:sessionEmail},function(err, resp){
    resp.user_online = false;
  });
  req.session.destroy((err) => {
    if(err){
      res.negotiate(err);
    }
  });
  res.redirect('/');
});


/* USER SEND PROFILE INFO TO SERVER. */
app.post('/settingProfile', function(req, res, next) {
  const sessionEmail = req.session.email;
  
  console.log(sessionEmail);
  var userInfo = User.findOne({user_email:sessionEmail}, function(err, resp){

    if(!err && resp){
      resp.user_smoker = req.body.user_smoker;
      resp.user_kindness = req.body.user_kindness;
      resp.user_talkative = req.body.user_talkative;
      resp.user_outgoing = req.body.user_outgoing;
      resp.user_humerous = req.body.user_humerous;
      resp.user_active = req.body.user_active;
      resp.user_moreInfo = req.body.user_moreInfo;
        

      smoker = resp.user_smoker;
      kindness = resp.user_kindness;
      talkative = resp.user_talkative;
      outgoing = resp.user_outgoing;
      humerous = resp.user_humerous;
      active = resp.user_active;
      moreInfo = resp.user_moreInfo;
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

/* USER SEND PREFERENCE INFO TO SERVER. */
app.post('/settingPreference', function(req, res, next) {
  const sessionEmail = req.session.email;
  
  console.log(sessionEmail + " set preference");
  var userInfo = User.findOne({user_email:sessionEmail}, function(err, resp){
    
    if(!err && resp){
      resp.user_Pref_gender = req.body.user_Pref_gender;
      resp.user_Pref_smoker = req.body.user_Pref_smoker;
      resp.user_Pref_kindness = req.body.user_Pref_kindness;
      resp.user_Pref_talkative = req.body.user_Pref_talkative;
      resp.user_Pref_outgoing = req.body.user_Pref_outgoing;
      resp.user_Pref_humerous = req.body.user_Pref_humerous;
      resp.user_Pref_active = req.body.user_Pref_active;
    
      var query 
      if(req.body.user_Pref_gender=="both"){
        query = {$or : [{user_gender :"male"},{user_gender : "female"}],
                 user_smoker : req.body.user_Pref_smoker,
                 $or :[{user_kindness : parseInt(req.body.user_Pref_kindness)-1},{user_kindness : req.body.user_Pref_kindness},{user_kindness : parseInt(req.body.user_Pref_kindness) +1}],
                 $or :[{user_talkative : parseInt(req.body.user_Pref_talkative)-1},{user_talkative : req.body.user_Pref_talkative},{user_talkative : parseInt(req.body.user_Pref_talkative) +1}],
                 $or :[{user_outgoing : parseInt(req.body.user_Pref_outgoing)-1},{user_outgoing : req.body.user_Pref_outgoing},{user_outgoing : parseInt(req.body.user_Pref_outgoing) +1}],
                 $or :[{user_humerous : parseInt(req.body.user_Pref_humerous)-1},{user_humerous : req.body.user_Pref_humerous},{user_humerous : parseInt(req.body.user_Pref_humerous) +1}],
                 $or :[{user_active : parseInt(req.body.user_Pref_active)-1},{user_active : req.body.user_Pref_active},{user_active : parseInt(req.body.user_Pref_active) +1}]
                }
      }
      else{
        query = { 
                user_gender : req.body.user_Pref_gender, 
                user_smoker : req.body.user_Pref_smoker,
                $or :[{user_kindness : parseInt(req.body.user_Pref_kindness)-1},{user_kindness : req.body.user_Pref_kindness},{user_kindness : parseInt(req.body.user_Pref_kindness) +1}],
                $or :[{user_talkative : parseInt(req.body.user_Pref_talkative)-1},{user_talkative : req.body.user_Pref_talkative},{user_talkative : parseInt(req.body.user_Pref_talkative) +1}],
                $or :[{user_outgoing : parseInt(req.body.user_Pref_outgoing)-1},{user_outgoing : req.body.user_Pref_outgoing},{user_outgoing : parseInt(req.body.user_Pref_outgoing) +1}],
                $or :[{user_humerous : parseInt(req.body.user_Pref_humerous)-1},{user_humerous : req.body.user_Pref_humerous},{user_humerous : parseInt(req.body.user_Pref_humerous) +1}],
                $or :[{user_active : parseInt(req.body.user_Pref_active)-1},{user_active : req.body.user_Pref_active},{user_active : parseInt(req.body.user_Pref_active) +1}]
              }
      }
      User.find(query, function(err, db){
        for(let i=0; i<db.length; i++){
 
          userPreference[db[i].user_email] = {
                  pref_fullname : db[i].user_fullname,
                  pref_gender : db[i].user_gender,
                  pref_smoker : db[i].user_smoker,
                  pref_kindness : db[i].user_kindness,
                  pref_talkative : db[i].user_talkative,
                  pref_outgoing : db[i].user_outgoing,
                  pref_humerous : db[i].user_humerous,
                  pref_active : db[i].user_active,
                  pref_moreInfo : db[i].user_moreInfo
          };
          
          console.log(db[i].user_fullname);          
        }
        console.log(" find user preference : " + Object.keys(userPreference));
      });


      var userProfile = new User(resp);
      userProfile.save(function(err, resp_){
        if(!err) {
          // console.log("no error defined" + resp_);
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
        if(req.body.user_gender==""){
          req.body.user_confPasswordError =  "Please select your gender";
          res.render('triends_register',{
            title:'Find your travelmate!',
            users : req.body
          });
        }
        res.render('triends_register',{
          title:'Find your travelmate!',
          users : req.body
        });
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

  req.body.user_invalidAccountError = "Invalid email or password. Try again";
  var validUser = User.findOne({user_email:req.body.loginEmail}, function(err, resp){
    if(resp.user_email==loginEmail && resp.user_password == loginPw){
      console.log("Log in successful!");
      email=loginEmail;
      username = resp.user_fullname;
      gender = resp.user_gender;
      smoker = resp.user_smoker;
      kindness = resp.user_kindness;
      talkative = resp.user_talkative;
      outgoing = resp.user_outgoing;
      humerous = resp.user_humerous;
      active = resp.user_active;
      moreInfo = resp.user_moreInfo;
      resp.user_online = true;
      // handleValidationError(err, req.body);
     
      res.redirect('/main');
    }
    else if(resp.user_email!=loginEmail || resp.user_password != loginPw){

      req.body.user_invalidAccountError = "Invalid email or password. Try again";

      req.session.err = 'Check your id or password'
      sess = sessionEmail;
      // res.redirect('/login');
      res.render('triends_login',{
        title:'Find your travelmate!',
        users : req.body
      });
    }    
  });
}



app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
