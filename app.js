var express = require("express"),
	app		= express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	methodOverride	= require("method-override");


//chat connection 
var http= require ('http').Server(app);
var io = require('socket.io')(http);

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));



app.get("/",function(req,res){
	res.render("home");
});

app.get("/chat",function(req,res){

	res.render('chat');
})

//socket related stuff
io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
});

http.listen(process.env.PORT || 3000, process.env.IP,function(){

	console.log("server started");
})
