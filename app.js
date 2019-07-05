var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    methodOverride = require("method-override"),
    normalizePort=require('normalize-port');

//routes
var indexRoute = require("./routes/index");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));

app.use("/",indexRoute);

var port = normalizePort(process.env.PORT || '3000');

var server = require('http').Server(app);

server.listen(port,function(){
  console.log("Sever Onling Port: "+port)
});
