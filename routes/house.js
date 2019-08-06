var express = require("express");
var router  = express.Router();
var House = require("../models/house");
var middleware = require("../middleware");
var { isLoggedIn, isAdmin} = middleware;


//index
router.get("/:address", function(req, res){
  House.findOne({address:req.params.address},function(err, houseObject){
    if(err){
      console.log(err);
    } else{
      res.render("house/index",{listingInfo: houseObject});
    }
  });
});

//new
router.get("/house/new",isLoggedIn, isAdmin, function(req,res){
  res.render("house/new");
});


//create
router.post("/house", isLoggedIn, isAdmin, function(req, res){

  var author = {
    id: req.user._id,
    username: req.user.username
  }

  //todo create carousel
   data = [{
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
  ];

  var newHouse = {
    address: req.body.address,
     onMarket: req.body.onMarket,
     isShowing: req.body.isShowing,
     description: req.body.description,
     carousel: data,
     author: author
   };


    House.create(newHouse, function(err, newlycreated) {
      if(err){
        console.log(req.body.address);
        console.log(err);
        res.redirect('back')
      }else{
        res.redirect('/'+newlycreated.address);
      }
    });

});

//edit
router.get("/:catagory/:title/edit",isLoggedIn, isAdmin, function(req, res){
  res.render("blog/edit",{catagory: req.params.catagory ,post:req.post});
});
//update
router.put("/:catagory/:title/edit",isLoggedIn, isAdmin, function(req, res){
  var newData = {imgsource: req.body.imgsource, quote: req.body.quote, text: req.body.blogText};

  Post.findOneAndUpdate({title:req.params.title}, {$set: newData}, function(err, post){
      if(err){
          req.flash("error", err.message);
          res.redirect("back");
      } else {
          req.flash("success","Successfully Updated!");
          res.redirect("/blog/"+ post.catagory+"/" + post.title);
      }
  });
});
//delete
router.delete("/:title",isLoggedIn, isAdmin, function(req, res){
  var cata =  req.post.catagory;
  var post_id = req.post._id;
  console.log(post_id);
  console.log("----------------------------------------------");
  Blog.findOneAndUpdate(cata, {$pull: {blogposts:post_id}},function(err,b){
    console.log(b);
  });

  Post.deleteOne({_id:post_id},function(err) {
        if(err) {
            req.flash('error', err.message);
            res.redirect('/');
        } else {
          console.log("meow");
            req.flash('success', 'Blog deleted!');
            res.redirect('/blog/'+cata);
        }
      })
});
//

module.exports = router;
