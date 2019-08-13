var mongoose = require("mongoose");

var HouseSchema = new mongoose.Schema({
    address_street: String,
    address_town: String,
    price: String,
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
