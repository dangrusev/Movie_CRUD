const express = require("express");
const app = express();
require('dotenv').config();
const cors = require("cors");
app.use(cors({origin: "https://lemon-sky-0fdced31e.2.azurestaticapps.net", methods: ["GET", "POST"]}));
app.use(express.json());
app.get("/", (req, res) => {res.send("Welcome to Movie_CRUD Backend!");
});

const path = require("path");
//FrontEnd deployed separately
//Using JSON and CORS for routing
// app.use(express.static(path.join(__dirname, '..', 'client')));
// app.get("/", (req, res) => {res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));});

//Mongo
app.use(express.urlencoded({extended:true}));
const mongoose = require("mongoose");
const Movie = require("./models/movieModel");
const mongooseUri = process.env.MONGODB_URI || "";
mongoose.connect(mongooseUri, {useNewUrlParser:true, useUnifiedTopology:true});



//Create route
app.post("/create", function(req,res) {let newNote = new Movie({title: req.body.title, comments: req.body.comments});
	newNote.save().then(() => res.json({success:true, redirectUrl:"https://lemon-sky-0fdced31e.2.azurestaticapps.net/"}));});

const renderNotes = (notesArray) => {let text = "Your Current Movie Collection:\n\n";
	notesArray.forEach((note) => 
		{text += "Movie's Title: " + note.title + "\n";
		 text += "Comments: " + note.comments + "\n";
		 text += "ID: " + note._id + "\n\n";
		})
		text += "Total Count: " + notesArray.length;
		return text
};

//Read route
app.get("/read", function(request, response) {Movie.find({}).then(notes => {
	response.type('text/plain');
	response.send(renderNotes(notes));
})});

//Update route
app.post("/update", (req,res) => {Movie.findOneAndUpdate(
	{ title: req.body.title}, {comments: req.body.comments}, {new: true}).then((movieUpdate) => {
		if (movieUpdate) {res.json({ success:true, redirectUrl: "https://lemon-sky-0fdced31e.2.azurestaticapps.net/"});}
		else {res.json({ success:false, message: "This movie is not in your collection!"});}
	})
});

//Delete route
app.post("/delete", (req,res) => {Movie.findOneAndDelete(
	{title: req.body.title}).then(movieDelete => {
		if (movieDelete) {res.json({ success:true, redirectUrl: "https://lemon-sky-0fdced31e.2.azurestaticapps.net/"});}
		else {res.json({ success:false, message: "This movie is not in your collection!"});}
	});
})

//Endpoint
const port = process.env.PORT || 3000
app.get('/test', function(request, response) {
	response.type('text/plain')
	response.send('Node.js and Express running on port='+port)
})

app.listen(port, function() {
	console.log("Server is running at http://localhost:3000/")
})
