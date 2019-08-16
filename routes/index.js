var express = require("express");
var House = require("../models/house");
var router  = express.Router();

router.get("/", function(req,res){
  res.locals.page="Landing";
  House.find({isShowing:true},function(err, houseObject){
    if(err){
      console.log(err);
    } else{
      res.render("Landing", {allHouses: houseObject});
    }
  });
});

//our homes route found in house.js

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
