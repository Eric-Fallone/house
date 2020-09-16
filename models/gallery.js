var mongoose = require("mongoose");

var GallerySchema = new mongoose.Schema({
    catagory: { type: String, unique:true, require:true},
    description: String,
    createdDate: { type: Date, default: Date.now },
    author: {
       id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
       },
       username: String
    },
    galleryposts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:"GalleryPost"
      }]
});

module.exports = mongoose.model("Gallery", GallerySchema);
