//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const homeStartingContent = "Welcome to the story of Tainted Love, a tale of two heroes! This classic tale takes a twisty turn when one of the heroes, Demarah (Dema), falls victim to evil and turns against the other main hero, Suq'il. The tale becomes a story of hero and villain to lovers as Suq'il sets out to save Dema from the demon that has possessed her.";
const aboutContent = "Avery Henderson and Alyssa Morgan are high school best friends who enjoy writing stories that pull their readers in. Along with written content for Tainted Love, Avery enjoys drawing lore pages of Dema and Suq'il.";
const contactContent = "Interested in contacting the writers? You can get in touch with Avery through her socials or by email at hendersona@morningside.edu";

const app = express();

let chapters = []; //initialize the chapters array

mongoose.connect("mongodb+srv://BaseAdmin:test123@cluster0.1n6wz4m.mongodb.net/taintedLoveChapters"); //connect to Mongoose server and create our DB

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const chapterSchema = {
  chapterNum: String,
  chapterContent: String
}; //create the schema for new chapters

const Chapter = mongoose.model("Chapter", chapterSchema); //create the model and collection based on our schema

app.get("/", function(req, res){

  Chapter.find({}, function(err, foundChapters) { //go collect the current chapters from our database
    if (err) {
      console.log("Unable to grab chapters");
    }

    res.render("home", {startingContent: homeStartingContent, chapters: foundChapters}); //render the home with the chapters
  });

}); //end app.get for home route

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){

  const chapterNumber = req.body.chapterNumber;
  const chapterContents = req.body.chapterContents;

  Chapter.findOne({chapterNum: chapterNumber}, function(err, foundChapter){
    if (foundChapter) {

      console.log("Chapter already exits. Not saving.");
      res.redirect("/");

    } //end if
    else {
      console.log("New chapter. Adding.");

      const newChapter = new Chapter ({
        chapterNum: chapterNumber,
        chapterContent: chapterContents
      });

      newChapter.save();
      res.redirect("/");
    }
  }); //end the findOne for the chapter we're trying to save

});

app.get("/chapters/:chapterid", function(req, res){

  const requestedChapterId = req.params.chapterid;

  Chapter.findOne({_id: requestedChapterId}, function(err, foundChapter){
    if (!err) {
      res.render("chapter", {
        chapterNumber: foundChapter.chapterNum,
        chapterContent: foundChapter.chapterContent
      });
    }
  });

});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
