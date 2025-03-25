const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionItemSchema = new Schema({
    id: { type: Number, required: true },
    type: { type: String, enum: ['movie', 'tv'], required: true }, 
    title: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true }
});

const singleTransactionSchema = new Schema({
    trans_id: { type: Number, required: true },
    movie_tv: [transactionItemSchema],
    date: { type: Date, default: Date.now } 
});

const transactionsSchema = new Schema({
    user_id: { type: Number, required: true },
    trans: [singleTransactionSchema]
}, { timestamps: true }); 

module.exports = mongoose.model('Transaction', transactionsSchema);