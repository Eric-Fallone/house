  var express = require("express");
var router  = express.Router();
var passport = require("passport");
var House = require("../models/house");
var User = require("../models/user");
var Gallery = require("../models/gallery");
var GalleryPost = require("../models/galleryPost");
var middleware = require("../middleware");
var { isLoggedIn, isAdmin, checkUserPost} = middleware;

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
//show admin view of our homes
router.get("/OurHomes", isAdmin, function(req,res){
  res.locals.page="OurHomes";
  House.find({},function(err, houseObject){
    if(err){
      console.log(err);
    } else{
      res.locals.page="OurHomes";
      res.render("OurHomes",{allHouses: houseObject});
    }
  });
});

//new gallery
router.get("/newgallery", isLoggedIn, isAdmin, function(req,res){
  res.locals.page="newgallery";
  res.render("gallery/newgallery");
});

//create gallery
router.post("/newgallery", isLoggedIn, isAdmin, function(req, res){

  var author = {
    id: req.user._id,
    username: req.user.username
  }

  var newGallery = {catagory: req.body.title, description: req.body.description, author: author}

  Gallery.create(newGallery, function(err, newlycreated) {
    if(err){
      console.log(err);
    }else{
      res.redirect("/")
    }
  });
});

//new
router.get("/:catagory/new",isLoggedIn, isAdmin, function(req,res){
  res.locals.page="newpost";
  res.render("gallery/newgallerypost",{catagory: req.params.catagory});
});
//create gallery post
router.post("/:catagory", isLoggedIn, isAdmin, function(req, res){

  var author = {
    id: req.user._id,
    username: req.user.username
  }

  if( req.files ){
    sampleFile = req.files.gallery_pic;
  // repositories/house/public/
    filepath = './public/photos/Pictures/gallery' + req.body.title+ '.jpg';

    sampleFile.mv(filepath, function(err) {
      if(err){
        console.log(err);
      }
    });
  }else {
    filepath = "";
  }

  var newPost = {catagory: req.params.catagory, title: req.body.title, imgsource: filepath, quote: req.body.quote, text: req.body.blogText, author: author};

  Gallery.findOne({catagory: req.params.catagory}, function(err,blog){
    if(err){
      console.log(err);
    } else{
      GalleryPost.create(newPost, function(err, newlycreated) {
        if(err){
          console.log(err);
        }else{
          blog.galleryposts.push(newlycreated._id);
          blog.save();
          newlycreated.index = blog.galleryposts.length;
          newlycreated.save();
          res.redirect("back");
        }
      });
    }
  });

});

//edit
router.get("/:catagory/:title/edit",isLoggedIn,isAdmin,checkUserPost, function(req, res){
  var maxPosts;
  Gallery.findOne(
    {catagory: req.params.catagory}).populate("galleryposts").exec( function(err,postObj){
      if(err){
        console.log(err);
      } else{
        maxPosts = postObj.galleryposts.length;
        res.render("gallery/editgallerypost",{catagory: req.params.catagory ,post:req.post, maxLoc:maxPosts});
      }
    });
});

//update
router.put("/:catagory/:title/edit",isLoggedIn,isAdmin,checkUserPost, function(req, res){
  var newData = {quote: req.body.quote, text: req.body.blogText, index: req.body.loc};
  console.log(req.post.index);
  console.log(req.body.loc);

  if(req.post.index == req.body.loc){
    GalleryPost.findOneAndUpdate({title:req.params.title}, {$set: newData}, function(err, post){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("back");
        }
    });
    return;
  }
  var start;
  var end;

  if(req.post.index < req.body.loc) {
    start = req.post.index;
    end = req.body.loc;
    GalleryPost.updateMany(
      {catagory: req.params.catagory, index: { $gte:start, $lte: end } },
      {$inc: {index: -1} }).exec(function(err, upDoot){
        GalleryPost.findOneAndUpdate({title:req.params.title}, {$set: newData}, function(err, post){
            if(err){
                req.flash("error", err.message);
                res.redirect("back");
            } else {
                req.flash("success","Successfully Updated!");
                res.redirect("back");
            }
        });
    });
  }else {
    start = req.body.loc;
    end = req.post.index;
    GalleryPost.updateMany(
      {catagory: req.params.catagory, index: { $gte:start, $lte: end } },
      {$inc: {index: 1} }).exec(function(err, upDoot){
        GalleryPost.findOneAndUpdate({title:req.params.title}, {$set: newData}, function(err, post){
            if(err){
                req.flash("error", err.message);
                res.redirect("back");
            } else {
                req.flash("success","Successfully Updated!");
                res.redirect("back");
            }
        });
    });
  }
});



//delete
router.delete("/:title", isLoggedIn,isAdmin, checkUserPost, function(req, res){
   console.log( req.params.title);

  //var cata =  req.post.catagory;
  var cata =  req.post.catagory;
  var post_id = req.post._id;

  console.log("----------------Deleteing------------------------------");
  console.log(req.post._id);
  console.log(req.gallerypost);

  Gallery.findOneAndUpdate({catagory:cata}, {$pull: {galleryposts:post_id}},function(err,b){
    //console.log(b);
  });

  GalleryPost.updateMany(
    {catagory: cata, index:{$gte:req.post.index}},
    {$inc: {index: -1} }).exec(function(err, upDoot){
  });

  GalleryPost.deleteOne({_id:post_id},function(err) {
        if(err) {
            req.flash('error', err.message);
            res.redirect('/');
        } else {
            req.flash('success', 'Post Deleted');
            res.redirect("/");
        }
      });
});


module.exports = router;
