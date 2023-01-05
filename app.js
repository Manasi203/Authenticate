
const bcrypt=require("bcrypt");
const saltRounds=10;
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));
app.set('view engine', 'ejs');
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1:27017/userDB", { useNewUrlParser: true });

const userSchema=new mongoose.Schema({
  email:String,
  password:String
})
//                          //key to encrypt database
// userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});
const User=mongoose.model("User",userSchema);



app.get("/",function(req,res){
  res.render("home");
})
app.get("/login",function(req,res){
  res.render("login");
})
app.get("/register",function(req,res){
  res.render("register");
})

app.post("/register",function(req,res){
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const newUser=new User({
      email:req.body.username,
      password:hash
    })
    newUser.save();
    res.render("secrets");
});
                                    //only when registered
})

app.post("/login",function(req,res){
  User.findOne({email:req.body.username},function(err,results){
    if(err){res.render(err);}
    else{  if(results){
        bcrypt.compare(req.body.password, results.password, function(err, result) {
              // result == true
              if(result)res.render("secrets");
       });


      }}

  })
})












app.listen(3000, function() {
  console.log("Server started on port 3000");
});
