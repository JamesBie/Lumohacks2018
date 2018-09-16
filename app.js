var express = require("express"),
	app		= express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	methodOverride	= require("method-override"),
    passport = require("passport"),
    LocalStrategy 	= require("passport-local");

//mongoose
var onlineUsers = require("./models/online");
var Profile = require ('./models/profile')

//chat connection
var http = require ('http').Server(app);
var io = require('socket.io')(http);
var online = 0;

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Lumohacks2018",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Profile.authenticate()));
passport.serializeUser(Profile.serializeUser());
passport.deserializeUser(Profile.deserializeUser());


app.use(function(req, res, next){
   res.locals.currentProfile = req.user; //this passes the user to everyone
   console.log(res.locals);
   next();
});




mongoose.connect("mongodb://localhost/Lumohacks2018");

//seeding database
Profile.collection.drop();
//Profile.create({username:"james",password:"password", street:"tyndall st", city: "coquitlam", province:"bc", latitude: 49.26438, longitude: -122.8918});
Profile.create({username:"andy",password:"password", street:"university crescent", city: "burnaby", province:"bc", latitude: 49.26438, longitude: -122.8918});
Profile.create({username:"daniel",password:"password", street:"kilrea crescent", city: "burnaby", province:"bc", latitude: 49.26438, longitude: -122.8918});
Profile.create({username:"george",password:"password", street:"No 3 Rd", city: "richmond", province:"bc", latitude: 49.26438, longitude: -122.8918});
//add to authentication
var newUser = new Profile({username:"james", street:"tyndall st", city: "coquitlam", province:"bc", latitude: 49.26438, longitude: -122.8918});
Profile.register(newUser,"password",function (err,user){
	if (err){
		console.log(err);
	}else{
		passport.authenticate("local");
	}
})

// https://geocoder.api.here.com/6.2/geocode.json
//   ?app_id=3TLV83DXqx0TQQWiB9Fg
//   &app_code=CdHErH1xR7ncjd4kIaKsRA
//   &searchtext=tyndall+st+coquitlam+bc
app.post("/signup/new",function(req,res){
	var newUser = new Profile({username:req.body.username, address: req.body.address, city: req.body.city, province:req.body.province, latitude: 49.26438, longitude: -122.8918});
Profile.register(newUser,"password",function (err,user){
	if (err){
		console.log(err);
	}else{
		passport.authenticate("local");
	}
});
	console.log("posting!!!");
	// const https = require('https');

	// https.get('https://geocoder.api.here.com/6.2/geocode.json?app_id=T2HX3ezMDxnyFx5Qq5Ga&app_code=nUnD3Z9maMOip9DofCleRQ&searchtext='+ 'kootenay'+ 'loop', (resp) => {
	// 	let data = '';

	// 	// A chunk of data has been recieved.
	// 	resp.on('data', (chunk) => {
	// 		data += chunk;
	// 	});

	// 	// The whole response has been received. Print out the result.
	// 	resp.on('end', () => {
	// 		var parsed = JSON.parse(data);JSON.parse(data)
	// 		var position = parsed["Response"]["View"]["0"]["Result"]["0"]["Location"]["DisplayPosition"];
	// 		var latitude = position["Latitude"];
	// 		var longitude = position["Longitude"];
	// 		console.log(longitude);
	// 	});
	// }).on("error", (err) => {
	// 	console.log("Error: " + err.message);
	// });
});


app.get("/",function(req,res){
	res.render("home");
});

app.get("/chat",function(req,res){
	res.render('chat');
});

app.get("/map",function(req,res){
	Profile.find({},function (err,allProfiles){
		if (err){
			console.log(err);
		}else{
			res.render('map', {profiles:allProfiles});
		}
	});
});

app.get("/signup",function(req,res){
	res.render("signup");
});



app.get("/signout", function (req,res){
  {
    req.logout();
    res.redirect("/");
  }

})


app.get("/login",function(req,res){
	res.render("login");
});


app.post("/login",passport.authenticate("local",
		{
			successRedirect: "/",
			failureRedirect: "/login"

		}

	) ,function(req,res){

});

//socket related stuff
io.on('connection', function(socket){
	console.log('a user connected');
	online = online + 1;
	onlineUsers.create({id: socket.id, username: online}, function(err, user){
		if (err){
			console.log(err);
		}else{
			console.log(user);
		}
	});

	socket.on('disconnect', function(){
		console.log('user disconnected');
		onlineUsers.findOneAndDelete({id: socket.id}, function(err, user){
			if (err){
				console.log(err);
			}else{
				console.log(user);
				online = online - 1;
			}
		});
	});
});

io.on('connection', function(socket){
	socket.on('chat message', function(msg){
		onlineUsers.findOne({id: socket.id}, function(err, result){
			if (err){
				console.log(err);
			}else{
				var user = result.username;
				io.emit('chat message', user + ": " + msg);
			}
		});
	});
});

http.listen(process.env.PORT || 3000, process.env.IP,function(){
	console.log("server started");
})
