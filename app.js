require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");




app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
// Connect to MongoDB
app.use(express.static("public"));
app.use(session({
  secret: "hi",
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize()); 
app.use(passport.session());
mongoose.connect('mongodb://localhost:27017/usersDB')

const ownerSchema = new mongoose.Schema({
    fullname: String,
    email: String,
    password: String,
    cart: {
        type: Array,
        default: []
    },
    product: {
        type: Array,
        default: []
    },
    
    contact: String,
    picture: String,
    gstin: Number

});

const Owner = mongoose.model('Owner', ownerSchema);



//user


const productSchema = new mongoose.Schema({
    image: Buffer,
    name: String,
    price: Number,
    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    bgcolor: String,
    panelColor: String,
    textColor: String


});

const Product = mongoose.model('Product', productSchema);





// passport configuration
 // Apply Passport Local Mongoose plugin


// Passport Configuration (call User.createStrategy() once)


// Session Management




const userSchema = new mongoose.Schema({
    fullname: String,
    email: String,
    password: String,
    cart: {
        type: Array,
        default: []
    },
    order: {
        type: Array,
        default: []
    },
    
    contact: String,
    picture: String


});



// Initialize Passport middleware
userSchema.plugin(passportLocalMongoose);


const User = mongoose.model("User", userSchema);
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// console.log("Passport configured");
app.get("/", function(req, res) {
    res.render("index", { error: "no" });
  });
  
app.post('/users/register', (req, res) => {
  User.register({
    username: req.body.email
    
  }, req.body.password, (err, user) => {
    if (err) {
      console.error(err);
      res.redirect("/err");
    }
    else {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/shop");
      });
    }
    
    });
      // Register new user
      
      
  
});

app.get("/error", (req, res) => {
  res.send("error");
});
app.get("/users", (req, res) => {
  if (req.isAuthenticated()) {  
    res.redirect("/shop");
  } else {

    res.send('Not authorized to view this page. Please login.');
  }
});

app.get("/shop", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("shop", { user: req.user });
  } else {
    res.send('Not authorized to view this page. Please login.');
  }
});

  app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
  });