var express = require("express");
var router  = express.Router();

router.get("/", function(req,res){
  res.render("Landing");
});

router.get("/About", function(req,res){
  res.render("About");
});

router.get("/Contact", function(req,res){
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
