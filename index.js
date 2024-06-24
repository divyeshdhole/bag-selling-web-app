const express = require('express'); 
const app = express();
const bodyParser = require('body-parser');
const ejs = require("ejs");
const db = require('./config/connection');
const ownersRoute = require('./routes/ownersRoute');    
const productsRoute = require('./routes/productsRoute');
const usersRoute = require('./routes/usersRoute');    


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.set("view engine", "ejs");

app.get("/owners", ownersRoute);
app.get("/products", productsRoute);
app.get("/users", usersRoute);

app.post("/owners", ownersRoute);


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});