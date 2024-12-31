const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const movieTvSchema = new Schema({
    id: { type: Number, required: true },
    type: { type: String, enum: ['movie', 'tv'], required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true } 
});

const cartSchema = new Schema({
    user_id: { type: Number, required: true, unique: true },
    movie_tv: [movieTvSchema]
});

module.exports = mongoose.model('Cart', cartSchema);