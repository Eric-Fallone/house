var express = require("express");
var router  = express.Router();
var House = require("../models/house");
var Gallery = require("../models/gallery");
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
  }).sort({index:1});
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

      Gallery.findOne({catagory: req.params.address}).populate({path:"galleryposts", options:{ sort:{index:1}}})
      .exec( function(err,GalleryPage){
        if(err){
          console.log(err);
        } else{
            res.render("house/index",{listingInfo:houseObject, PhotoGallery:GalleryPage});
        }
      });
    }
  });
});

//create
router.post("/", isLoggedIn, isAdmin, function(req, res){

  var author = {
    id: req.user._id,
    username: req.user.username
  }

  if( req.files ){
    sampleFile = req.files.thumb_pic;
  // repositories/house/public/
    filepath = './public/photos/Pictures/thumb' + req.body.address_street + '.jpg';

    sampleFile.mv(filepath, function(err) {
      if(err){
        console.log(err);
      }
    });
  }else {
    filepath = "";
  }

  var totalHouses;

  House.find( {},function(err, allHouses){
    if(err){
      console.log(err);
    } else{
      totalHouses = allHouses.length;

      var newHouse = {
        index: totalHouses + 1,
        address_street: req.body.address_street,
        address_town: req.body.address_town,
        picture_main: filepath,
        price: req.body.price,
        onMarket: req.body.onMarket,
        isShowing: req.body.isShowing,
        isShowingMainPage: req.body.isShowingMainPage,
        blerb: req.body.blerb,
        description: req.body.description,
        author: author
       };


        House.create(newHouse, function(err, newlycreated) {
          if(err){
            console.log(err);
            res.redirect('back')
          }else{

            var newGallery = {catagory: req.body.address_street, description: "Unused", author: author}

            Gallery.create(newGallery, function(err, newlycreatedgal) {
              if(err){
                console.log(err);
              }else{
                res.redirect('/OurHomes/'+newlycreated.address_street);
              }
            });
          }
        });

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

      House.find({},function(err, allHouses){
        if(err){
          console.log(err);
        } else{
          res.render("house/edit",{listingInfo:houseObject, maxLoc: allHouses.length });
        }
      });
    }
  });
});

//update
router.put("/:address/edit",isLoggedIn, isAdmin, function(req, res){

var oldPos;
  House.findOne({address_street:req.body.address_street}, function(err, houseObject){
      if(err){
          console.log(err.message);
          req.flash("error", err.message);
          res.redirect("back");
      } else {
          oldPos = houseObject.index;


          if( req.files){
            console.log(req.files.thumb_pic);
            sampleFile = req.files.thumb_pic;

            //todo delete or get this to replace current file on sever

            filepath = './public/photos/Pictures/thumb' + req.files.thumb_pic.name + '.jpg';

            sampleFile.mv(filepath, function(err) {
              if(err){
                console.log(err);
              }else {
                var newHouse = {
                  index: req.body.loc,
                  address_town: req.body.address_town,
                  picture_main: filepath,
                  price: req.body.price,
                  onMarket: req.body.onMarket,
                  isShowing: req.body.isShowing,
                  isShowingMainPage: req.body.isShowingMainPage,
                  description: req.body.description,
                  blerb: req.body.blerb
                 };
              }
            });
          }else {
            var newData = {
              index: req.body.loc,
              address_town: req.body.address_town,
              price: req.body.price,
              onMarket: req.body.onMarket,
              isShowing: req.body.isShowing,
              isShowingMainPage: req.body.isShowingMainPage,
              description: req.body.description,
              blerb: req.body.blerb
            };
          }

        if( oldPos == req.body.loc ){

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
          return;
        }
        console.log(oldPos);
        console.log(req.body.loc);
        var start, end;


        if(oldPos < req.body.loc) {
          start = oldPos;
          end = req.body.loc;
          House.updateMany(
            {index: { $gte:start, $lte: end } },
            {$inc: {index: -1} }).exec(function(err, upDoot){
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
        }else {
          start = req.body.loc;
          end = oldPos;
          House.updateMany(
            { index: { $gte:start, $lte: end } },
            {$inc: {index: 1} }).exec(function(err, upDoot){
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
        }
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

            Gallery.deleteOne({catagory:req.params.address},function(err) {
                  if(err) {
                      req.flash('error', err.message);
                      res.redirect('/');
                  } else {
                      req.flash('success', ' Gallery for Listing deleted!');
                      res.redirect('/');
                  }
                });
        }
      });
});
//

module.exports = router;
