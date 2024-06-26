require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const multer = require('multer');
const storage = multer.memoryStorage();
const flash = require('connect-flash');
app.use(flash()); // Initialize connect-flash middleware

const upload = multer({ storage: storage });
// const MongoStore = require('express-session-mongodb');


app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));


app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    // cookie: { secure: true }
  }))

app.use(passport.initialize()); 
app.use(passport.session());


mongoose.connect("mongodb://localhost:27017/usersDB");
//---------------------------------------- User Configuration--------------------------------------
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
    panelcolor: String,
    textcolor: String


});

const userSchema = new mongoose.Schema({
    fullname: String,
    email: String,
    password: String,
    cart: [
        {
            type: productSchema
            
        }
    ],
    order: {
        type: Array,
        default: []
    },
    
    contact: String,
    picture: String


});


userSchema.plugin(passportLocalMongoose);


const User = mongoose.model("User", userSchema);
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

let error = {message: ""};

app.get("/", function(req, res) {
    res.render("index", {error: req.flash("error"), loggedin: false});
})



app.post("/users/register", function(req, res) {
    User.register({fullname: req.body.fullname, username: req.body.username}, req.body.password, function(err, user) {
        if(err) {
            console.log(err);
            error = err;
            req.flash("error", err.message);
            res.redirect("/");
        } else {
            passport.authenticate("local")(req, res, function() {
                res.redirect("/shop");
            });
        }
    });
});
//if username and password are incorrect the err message how to store in error object
app.post("/users/login", passport.authenticate("local", {
    successRedirect: "/shop",
    failureRedirect: "/",
    failureFlash: true
    
  }), function(req, res) { 
    // req.flash("success", "Logged in successfully!");
    res.redirect("/shop");
  }
);
app.get("/users/logout", function(req, res) {
    req.logout(
        function(err) {
            if (err) { return next(err);
}});
    res.redirect("/");
});



app.get("/shop", (req, res) => {
    
    if (req.isAuthenticated()) {
        Product.find()
        .then(products => {
            res.render("shop", { products: products , success: success});
        })

    } else {
        res.redirect("/");
    }
  });

  //--------------------------------------------------------------Admin Configuration---------------------
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
let success = {message: ""};
app.get("/owners/admin", (req, res) => {
    res.render("createproducts", {success: success});
});




//------------------------------------------Product----------------------------------------


const Product = mongoose.model('Product', productSchema);

app.post("/owners/products/create", upload.single("image"), (req, res) => {
    const product = new Product({
        image: req.file.buffer,
        name: req.body.name,
        price: req.body.price,
        discount: req.body.discount,
        bgcolor: req.body.bgcolor,
        panelcolor: req.body.panelcolor,
        textcolor: req.body.textcolor     
    });
    success = product.name + " added successfully!";
    
    product.save();
    res.redirect("/owners/admin");
});

app.get("/addtocart/:id", (req, res) => {
    //authentication check
    if (!req.isAuthenticated()) {
        res.redirect("/");
    }
    else {
        Product.findById(req.params.id)
        .then( function(product) {
            User.findByIdAndUpdate(req.user._id, {$push: {cart: product}}, { new: true })
            .then(function() {
                success = product.name + " added to cart!";
                    res.redirect("/shop");
            })
        })}
    
});
app.get("/cart", (req, res) => {
    if (!req.isAuthenticated()) {
        res.redirect("/");
    }
    else {
        User.findById(req.user._id)
       .populate("cart")
       .exec()
        .then(function(user) {
            console.log(user.cart);
            res.render("cart", {user: user});
        }
        
    )
}});
    
app.listen(3000, function() {
    console.log("Server is running on port 3000");
})