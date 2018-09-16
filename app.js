var express = require("express"),
	app		= express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	methodOverride	= require("method-override");

//mongoose
var onlineUsers = require("./models/online");
var Profile = require ('./models/profile')

//chat connection
var http= require ('http').Server(app);
var io = require('socket.io')(http);
var online = 0;

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

mongoose.connect("mongodb://localhost/Lumohacks2018");




app.get("/",function(req,res){
	res.render("home");
});

app.get("/chat",function(req,res){

	res.render('chat');
})

//socket related stuff
io.on('connection', function(socket){
  console.log('a user connected');
  online = online + 1;
  onlineUsers.create({username: socket.id}, function(err, user){
    if (err){
  		console.log(err);
  	}else{
  		console.log(user);
  	}
  });

  	socket.on('disconnect', function(){
    console.log('user disconnected');
    onlineUsers.findOneAndDelete({username: socket.id}, function(err, user){
    	if (err){
    		console.log(err);
    	}else{
    		console.log(user);
    		online = online -1;
    	}
    	});
	});

});

io.on('connection', function(socket)
{  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
});

http.listen(process.env.PORT || 3000, process.env.IP,function(){

	console.log("server started");
})
