var mongoose = require("mongoose");

var CarouselSchema = new mongoose.Schema({
    url: String,
    title: String,
    subtext: String
});

module.exports = mongoose.model("Carouse", CarouseSchema);
