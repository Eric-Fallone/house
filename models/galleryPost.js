var mongoose = require("mongoose");

var GalleryPostSchema = new mongoose.Schema({
    index: Number,
    catagory: { type: String, unique:true, require:true},
    title: { type: String, unique:true, require:true},
    imgsource: String,
    text: String,
    createdDate: { type: Date, default: Date.now },
    author: {
       id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
       },
       username: String
    }
});

module.exports = mongoose.model("GalleryPost", GalleryPostSchema);
