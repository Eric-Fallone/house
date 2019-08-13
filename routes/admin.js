var express = require("express");
var router  = express.Router();
var passport = require("passport");
var House = require("../models/house");
var User = require("../models/user");
var middleware = require("../middleware");
var { isLoggedIn, isAdmin} = middleware;

//loggin show
router.get("/Login", function(req,res){
  res.locals.page="Login";
  res.render("Login");
});
//loggin create
router.post("/Login", passport.authenticate("local",
  {
    successRedirect:"/",
    failureRedirect:"/Admin/Login",
    failureFlash:true,
  }), function(req,res){
});

//logout
router.get("/logout", function(req, res){
  req.logout();
  req.flash("success","Logout Successful");
  res.redirect("/");
});

//Register show
router.get("/register", function(req,res){
    res.locals.page="Register";
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
