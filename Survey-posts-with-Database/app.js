//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Welcome to our daily journal posting website, your personal haven for self-expression and reflection. As you land on our inviting home page, a soothing palette of muted pastels greets you, immediately instilling a sense of calm and introspection. The seamless blend of modern aesthetics with a touch of rustic charm sets the tone for your journaling journey. The text style, a harmonious marriage of elegance and readability, ensures that your thoughts take center stage. Each word you type is adorned with a font that strikes the perfect balance between artistic flair and utmost clarity. The thoughtful indentations in the text not only enhance the visual appeal but also create a visual rhythm that guides your eyes gracefully across the screen. Our user-centric design places the navigation bar at the top, allowing you to effortlessly explore different journal categories – be it gratitude, personal growth, or creative musings. The intuitive layout invites you to begin your journaling endeavor without any distractions. Whether you're an early morning writer seeking a serene atmosphere or a late-night thinker embracing the quietude, our website adapts seamlessly to your preferred time, thanks to its dark mode feature. In a world that moves at a relentless pace, our daily journal posting website stands as your digital retreat, where text style and indentations intertwine to offer you a serene space for daily contemplation and mindful expression.";
const aboutContent = "Welcome to our Daily Journal Posting website – your digital haven for capturing life's moments and weaving them into beautiful narratives. Our 'About Us' page is the heart and soul of this platform, embodying the essence of our mission and passion. With a seamless blend of elegant design and intuitive functionality, we empower you to transform your daily experiences into eloquent chronicles. Our team consists of dedicated writers, tech enthusiasts, and creatives who understand the profound significance of journaling in today's fast-paced world. We believe that within the tapestry of everyday life lie extraordinary tales waiting to be told. Whether it's jotting down your morning musings, sharing your globetrotting escapades, or simply immortalizing a heartfelt conversation, our platform provides the perfect canvas for your words. As you embark on this journaling journey with us, envision crisp pages filling with your unique narrative, enriched by the evergreen charm of digital documentation. Join us in redefining the art of storytelling in the digital age. Your story matters, and the world deserves to hear it – elegantly displayed on the pages of our Daily Journal Posting website.";
const contactContent = "Welcome to our Daily Journal posting website's 'Contact Us' page, where connecting with us is as effortless as jotting down your thoughts. Our commitment to seamless communication is mirrored in this interface. With a harmonious blend of user-friendly design and an inviting color palette, reaching out has never been more inviting. Whether you have inquiries about our journaling categories, technical quandaries, or simply want to share your feedback, this is the conduit. Expect prompt responses from our dedicated team, who share your passion for journaling. Discover the art of hassle-free dialogue as you navigate through this page. Your journey is our priority, and 'Contact Us' ensures that your voice is heard, valued, and woven into the tapestry of our journaling community.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/blogDB", {useNewUrlParser: true});

const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Post = mongoose.model("Post", postSchema);



app.get("/",async function(req, res){
  let posts = await Post.find({}).exec();
  res.render("home", { startingContent: homeStartingContent, posts: posts });
});

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
  
  const post = new Post({
    title: _.capitalize(req.body.postTitle),
    content: req.body.postBody
  });

  post.save()
    .then((user) => {
       res.redirect("/");
  })
  .catch((error) => {
      console.log(err);
      res.send(400, "Bad Request");

  });

});

app.get("/posts/:postId",function(req, res){
  const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}).then(function (foundPost) {
       res.render("post", {title: foundPost.title, content: foundPost.content});
});
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
