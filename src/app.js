require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
require("./db/connect");
const Register = require("./models/registerModels");
const port = process.env.PORT || 8000

const static_path = path.join(__dirname,"../public");
const template_path = path.join(__dirname,"../templates/views");
const partial_path = path.join(__dirname,"../templates/partials");
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(static_path));
app.set("view engine","hbs");
app.set("views",template_path);
hbs.registerPartials(partial_path);
//routing
app.get("/",(req,res)=>{
    res.render("index");
});
app.get("/register",(req,res)=>{
    res.render("register");
});
//crud operations
app.post("/register",async (req,res)=>{
    try {
        const pass = req.body.password;
        const cpass = req.body.cpassword;
        if(pass === cpass){
            const data = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                gender: req.body.gender,
                password: pass,
                cpassword: cpass,
                number: req.body.number
            });
            const token = await data.generatToken();
            console.log(token);
            
            const registered = await data.save();
            res.status(201).send(registered);
        }else{
            res.send("password not matched");
        }
        
    } catch (error) {
        res.status(404).send(error);
    }
});
app.get("/login",(req,res)=>{
    res.render("login");
});
app.post("/login", async (req,res)=>{
    try {
        const email = req.body.email;
        const pass = req.body.password;
        const useremail = await Register.findOne({email:email});
        const isMatch = await bcrypt.compare(pass,useremail.password);
        const token = await useremail.generatToken();
        console.log(token);
       
        if(isMatch){
            res.status(201).render("index");
        }
        else{
            res.send("pass not matched");
        }
    } catch (error) {
        res.status(401).send(error);
    }
});
app.listen(port,()=>{
    console.log(`server running at port ${port}`);
});

