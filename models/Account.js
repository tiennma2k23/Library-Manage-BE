const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
    AccountID: Number,
    Email: String,
    Password: String,
    Name: String,
    Gender: String,
    Age: Number,
    Role: String,
    State: String, 
    Address: String,
    Phone: String,
    FrontImage: String,
    BackImage: String
});

module.exports = mongoose.model('Account', AccountSchema);