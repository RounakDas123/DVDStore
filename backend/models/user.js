const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    user_id: { type: Number, required: true, unique: true }, 
    user_name: { type: String, required: true, unique: true }, 
    email_id: { type: String, required: true, unique: true, match: /.+@.+\..+/ }, 
    password: { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);