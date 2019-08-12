var express = require("express");
var router  = express.Router();

router.get("/", function(req,res){
  res.locals.page="Landing";
  res.render("Landing");
});

router.get("/OurHomes", function(req,res){
  res.locals.page="OurHomes";
  res.render("OurHomes");
});

router.get("/About", function(req,res){
  res.locals.page="About";
  res.render("About");
});

router.get("/Gallery", function(req,res){
  res.locals.page="Gallery";
  res.render("Gallery");
});

router.get("/Contact", function(req,res){
  res.locals.page="Contact";
  res.render("Contact");
});

router.post("/Contact",   function(req, res){

  email = {
    name:req.body.name,
    email:req.body.email,
    subject:req.body.subject,
    message:req.body.emailmsg,
  };
  //emailer.sendEmail(email);
  req.flash("success","Email Sender not Hooked up yet");
  res.redirect("/");
});
module.exports = router;
