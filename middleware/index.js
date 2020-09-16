var GalleryPost = require("../models/galleryPost");

module.exports = {
  isLoggedIn: function(req, res, next){
      if(req.isAuthenticated()){
          return next();
      }
      res.redirect('/');
  },
  isAdmin: function(req, res, next) {
    if(req.user.isAdmin) {
      next();
    } else {
      res.redirect('/');
    }
  },
  checkUserPost: function(req, res, next){
    GalleryPost.findOne({title: req.params.title}, function(err, foundPost){
      if(err || !foundPost){
          console.log(err);
          req.flash('error', 'Sorry, that galleryPost does not exist!');
          res.redirect("/");
      } else if(foundPost.author.id.equals(req.user._id) || req.user.isAdmin){
          req.post = foundPost;
          next();
      } else {
          req.flash('error', 'You don\'t have permission to do that!');
          res.redirect("/");
      }
    });
  }
}
