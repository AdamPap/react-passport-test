const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    stripeId: String,
    type: {
        type: String,
        default: 'free'
    },
    subscription: String
})

module.exports = mongoose.model('User', userSchema);