const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const registerSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    gender:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    cpassword:{
        type:String,
        required:true
    },
    number:{
        type:Number,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
});
//generating tokens
registerSchema.methods.generatToken = async function(){
    try {
        console.log(this._id);
        const token = jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;
    } catch (error) {
        console.log('token error');
        
    }
}
//hashing password
registerSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10);
        this.cpassword = await bcrypt.hash(this.password,10);
    }
    next();
})

const Register = new mongoose.model("Register",registerSchema);

module.exports = Register;