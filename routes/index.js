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
module.exports = router;
