const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    phone:String,
    address:String,
    role:String
})

mongoose.model('login',userSchema);
module.exports = mongoose.model('login')