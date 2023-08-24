//jshint esversion:6

import 'dotenv/config'
import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import _ from "lodash";
import mongoose from "mongoose";
import encrypt from "mongoose-encryption";


mongoose.connect("mongodb://127.0.0.1:27017/userDB", {useNewUrlParser: true});

const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// Schema
const userSchema = new mongoose.Schema({
email: String,
password: String,
});


// encryption

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields : ["password"] });

// model
const User = new mongoose.model("User",userSchema);


app.get("/",(req,res)=>{
 res.render("home")
});


app.get("/login",(req,res)=>{
    res.render("login")
   });
   
app.get("/register",(req,res)=>{
    res.render("register")
   });

app.post("/register",(req,res)=>{
// new doc
const newUser = new User ({
email : req.body.username,
password : req.body.password,
});

newUser.save()
.then(()=>{
console.log("Successful Saved in the Database");
res.render("secrets")
})
.catch((err)=>{
console.log("err");
});
});


app.post("/login",(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username})
    .then((foundlist)=>{
 if(foundlist.password === password){
    res.render("secrets")
    // console.log(foundlist.password);
 }
    })
    .catch((err)=>{
console.log("err");
    });

});



app.listen(port, function() {
    console.log(`Server started on port ${port}`);
  });