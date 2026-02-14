// 
const mongoose =require('mongoose');
const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required:true,
        trime: true,
    },
    email:{
        type: String,
        required: true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    role:{
        type:String,
        enum:["admin","user"],
     default:"user"

    }
},{timestamps: true})

const user = mongoose.model("user",userSchema);

