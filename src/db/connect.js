const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/developer",{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log('CONNECTION SUCCESSFUL');
}).catch((err)=>{
    console.log('CONNECTION FAILED');
});