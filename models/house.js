var mongoose = require("mongoose");

var HouseSchema = new mongoose.Schema({
    address: { type: String, unique:true, require:true},
    onMarket: String,
    isShowing: Boolean,
    description: String,
    createdDate: { type: Date, default: Date.now },
    author: {
       id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
       },
       username: String
    },
    carousel:[]
});

module.exports = mongoose.model("House", HouseSchema);
