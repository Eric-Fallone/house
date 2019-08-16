var express = require("express");
var router  = express.Router();
var House = require("../models/house");
var middleware = require("../middleware");
var { isLoggedIn, isAdmin} = middleware;



//list of Houses
router.get("/", function(req,res){
  res.locals.page="OurHomes";
  House.find({isShowing:true},function(err, houseObject){
    if(err){
      console.log(err);
    } else{
      res.locals.page="OurHomes";
      res.render("OurHomes",{allHouses: houseObject});
    }
  });
});

//new
//has to be above index
router.get("/new",isLoggedIn, isAdmin, function(req,res){
  res.locals.page="OurHomes";
  res.render("house/new");
});

//index
router.get("/:address", function(req, res){
  House.findOne({address_street:req.params.address},function(err, houseObject){
    if(err){
      console.log(err);
    } else{
      res.locals.page="OurHomes";
      res.render("house/index",{listingInfo: houseObject});
    }
  });
});

//create
router.post("/", isLoggedIn, isAdmin, function(req, res){

  var author = {
    id: req.user._id,
    username: req.user.username
  }
  data=[];
  //todo create carousel
   /* data = [{
  		"url": "https://static.wixstatic.com/media/764cd8_c29ecf55ac8142e19dad9386ec21b4d8~mv2.jpg/v1/fill/w_970,h_526,al_c,q_85,usm_0.66_1.00_0.01/764cd8_c29ecf55ac8142e19dad9386ec21b4d8~mv2.webp",
  		"title": "Title One",
  		"subtext": "Sub text one"
  	},
  	{
  		"url": "https://static.wixstatic.com/media/764cd8_c29ecf55ac8142e19dad9386ec21b4d8~mv2.jpg/v1/fill/w_970,h_526,al_c,q_85,usm_0.66_1.00_0.01/764cd8_c29ecf55ac8142e19dad9386ec21b4d8~mv2.webp",
  		"title": "Title two",
  		"subtext": "Sub text two"
  	},
  	{
  		"url": "https://static.wixstatic.com/media/764cd8_c29ecf55ac8142e19dad9386ec21b4d8~mv2.jpg/v1/fill/w_970,h_526,al_c,q_85,usm_0.66_1.00_0.01/764cd8_c29ecf55ac8142e19dad9386ec21b4d8~mv2.webp",
  		"title": "Title three",
  		"subtext": "Sub text three"
  	}
  ]; */
  console.log(req.files);
  sampleFile = req.files.thumb_pic;
// repositories/house/public/
  filepath = './public/photos/Pictures/thumb' + req.body.address_street + '.jpg';

  sampleFile.mv(filepath, function(err) {
    if(err){
      console.log(err);
    }
  });

  var newHouse = {
    address_street: req.body.address_street,
    address_town: req.body.address_town,
    picture_main: filepath,
    price: req.body.price,
    onMarket: req.body.onMarket,
    isShowing: req.body.isShowing,
    description: req.body.description,
    carousel: data,
    author: author
   };


    House.create(newHouse, function(err, newlycreated) {
      if(err){
        console.log(err);
        res.redirect('back')
      }else{
        res.redirect('/OurHomes/'+newlycreated.address_street);
      }
    });

});

//edit
router.get("/:address/edit",isLoggedIn, isAdmin, function(req, res){
  House.findOne({address_street:req.params.address},function(err, houseObject){
    if(err){
      console.log(err);
    } else{
      res.locals.page="OurHomes";
      res.render("house/edit",{listingInfo:houseObject});
    }
  });
});

//update
router.put("/:address/edit",isLoggedIn, isAdmin, function(req, res){

  var newData = {
    address_town: req.body.address_town,
    price: req.body.price,
    onMarket: req.body.onMarket,
    isShowing: req.body.isShowing,
    description: req.body.description
  };

  House.findOneAndUpdate({address_street:req.body.address_street}, {$set: newData}, function(err, houseObject){
      if(err){
          console.log(err.message);
          req.flash("error", err.message);
          res.redirect("back");
      } else {
          req.flash("success","Successfully Updated!");
          res.redirect("/OurHomes/" + houseObject.address_street);
      }
  });
});

//delete
router.delete("/:address",isLoggedIn, isAdmin, function(req, res){

  House.deleteOne({address_street:req.params.address},function(err) {
        if(err) {
            req.flash('error', err.message);
            res.redirect('/');
        } else {
            req.flash('success', 'Listing deleted!');
            res.redirect('/');
        }
      })
});
//

module.exports = router;
