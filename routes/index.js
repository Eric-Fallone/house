var express = require("express");
var House = require("../models/house");
var Gallery = require("../models/gallery");
var router  = express.Router();
var emailer = require("../public/scripts/email.js")

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

  Gallery.findOne({catagory: "PhotoGalleryPage"}).populate({path:"galleryposts", options:{ sort:{index:1}}})
  .exec( function(err,GalleryPage){
    if(err){
      console.log(err);
    } else{
      res.render("Gallery",{PhotoGalleryPage:GalleryPage});
    }
  });
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

  emailer.sendEmail(email);
  req.flash("success","Email Sent!");
  res.redirect("/Contact");

});
module.exports = router;
