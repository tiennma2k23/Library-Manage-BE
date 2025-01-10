const mongoose = require('mongoose');

const LoanSchema = new mongoose.Schema({
    LoanID: { type: Number, required: true },
    AccountID: { type: mongoose.Schema.Types.ObjectId, required: true },
    BookID: { type: mongoose.Schema.Types.ObjectId, required: true },
    DayStart: Date,
    DayEnd: Date,
    Note: String,
    State: String
});

module.exports = mongoose.model('Loan', LoanSchema);