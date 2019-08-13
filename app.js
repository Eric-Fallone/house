var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    methodOverride = require("method-override"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    cookieParser = require("cookie-parser"),
    LocalStrategy = require("passport-local"),
    flash        = require("connect-flash"),
    session = require("express-session"),
    methodOverride = require("method-override"),
    User        = require("./models/user"),
    House        = require("./models/house"),
    normalizePort=require('normalize-port');

require('dotenv').config();
//routes
var indexRoute = require("./routes/index"),
    houseRoute = require("./routes/house"),
    adminRoute = require("./routes/admin");


mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGOOSE_URL, {
  useNewUrlParser: true,
  useCreateIndex: true
}).then(()=> {
  console.log('Connecected to DB');
}).catch(err => {
  console.log("ERROR",err.message);
});


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(cookieParser('secret'));
app.use(flash());

//require moment
app.locals.moment = require('moment');

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: process.env.PASSPORT_SECRET,
    resave: true,
    rolling: true,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 3600000 //1 hour
    }
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
});

app.use("/admin",adminRoute);
app.use("/OurHomes",houseRoute);
app.use("/",indexRoute);

var port = normalizePort(process.env.PORT || '3000');

var server = require('http').Server(app);

server.listen(port,function(){
  console.log("Sever Onling Port: "+port)
});
