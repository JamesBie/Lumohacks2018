var express = require("express"),
	app		= express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	methodOverride	= require("method-override");

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

	res.render("chat");
})

app.get("/signup",function(req,res){

	res.render("signup");
})

app.listen(process.env.PORT || 3000, process.env.IP,function(){

	console.log("server started");
})
