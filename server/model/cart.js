const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    cart_id: {
        type: mongoose.Schema.Types.ObjectId,
        default: mongoose.Types.ObjectId,
    },
    buyer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "buyer",
        required: true,
    },
    products: [
        {
            product_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "product",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                default: 1,
            }
        }
    ]
}, { timestamps: true });  // Adds createdAt and updatedAt fields

module.exports = mongoose.model("cart", cartSchema);
