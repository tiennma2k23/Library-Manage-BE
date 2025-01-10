const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    Name: { type: String, required: true },
    Cover: { type: String },
    Quantity: { type: Number, default: 0 }
});

module.exports = mongoose.model('Category', CategorySchema);