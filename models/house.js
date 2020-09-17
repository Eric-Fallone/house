var mongoose = require("mongoose");

var HouseSchema = new mongoose.Schema({
    address_street: { type: String, unique:true, require:true},
    address_town: String,
    picture_main: String,
    price: String,
    onMarket: String, //  1  Currently for Sale   2  About to go to market   3 Sold 4 under contract
    isShowing: Boolean,
    isShowingMainPage: Boolean,
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
