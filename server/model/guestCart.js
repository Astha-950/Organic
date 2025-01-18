// models/GuestCart.js
const mongoose = require('mongoose');

const GuestCartSchema = new mongoose.Schema({
    guestId: {
        type: String,
        required: true,
        unique: true,
    },
    items: [
        {
            product_id: {
                type: String,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
            },
            price: {
                type: Number,
                required: true,
            },
            image: String,
            description: String,
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400, // Cart expires after 24 hours
    },
});

const GuestCart = mongoose.model('GuestCart', GuestCartSchema);

module.exports = GuestCart;
