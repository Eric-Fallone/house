var mongoose = require("mongoose");

var HouseSchema = new mongoose.Schema({
    location: { type: String, unique:true, require:true},
    onMarket: Boolean,
    description: String,
    createdDate: { type: Date, default: Date.now },
    author: {
       id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
       },
       username: String
    }
});

module.exports = mongoose.model("House", HouseSchema);
