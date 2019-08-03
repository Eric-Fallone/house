var express = require("express");
var router  = express.Router();
var passport = require("passport");
var House = require("../models/house");
var User = require("../models/user");
var middleware = require("../middleware");
var { isLoggedIn, isAdmin} = middleware;

//loggin show
router.get("/login", function(req,res){
  res.render("Login");
});
//loggin create
router.post("/login", passport.authenticate("local",
  {
    successRedirect:"/",
    failureRedirect:"/login"
  }), function(req,res){
});


//Register show
router.get("/register", function(req,res){
  res.render("Register");
});
//Register create - (login authenticate)
router.post("/register",function(req,res){
  var newUser = new User({username: req.body.username});

    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("Register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
          res.redirect("/");
        });
    });
});
//







module.exports = router;
