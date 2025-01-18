// controllers/guestController.js
const mongoose = require('mongoose');
const GuestCart = require('../model/guestCart'); // Import guest cart schema

// Generate unique guest ID
function generateGuestId() {
    return 'guest_' + Math.random().toString(36).substr(2, 9);
}

// Register guest (create a session if not exists)
async function registerGuest(req) {
    if (!req.session.guestId) {
        const guestId = generateGuestId();
        req.session.guestId = guestId;
        const newCart = new GuestCart({ guestId, items: [] });
        await newCart.save();
    }
    return req.session.guestId;
}

// Handle guest registration from frontend button
exports.registerGuestOnClick = async (req, res) => {
    const guestId = await registerGuest(req);
    res.status(200).json({ guestId, message: 'Guest session created' });
};

// Add item to cart for guest user
exports.addToCart = async (req, res) => {
    const { product_id, quantity, price, image, description } = req.body;
    const guestId = await registerGuest(req);

    let cart = await GuestCart.findOne({ guestId });

    const existingItem = cart.items.find(item => item.product_id.toString() === product_id);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.items.push({ product_id, quantity, price, image, description });
    }

    await cart.save();
    res.status(200).json({ message: 'Item added to cart' });
};

// Delete item from cart for guest user
exports.removeFromCart = async (req, res) => {
    const { product_id } = req.body;
    const guestId = await registerGuest(req);

    let cart = await GuestCart.findOne({ guestId });

    const updatedItems = cart.items.filter(item => item.product_id.toString() !== product_id);
    cart.items = updatedItems;

    await cart.save();
    res.status(200).json({ message: 'Item removed from cart' });
};

// View cart for guest user
exports.viewCart = async (req, res) => {
    const guestId = await registerGuest(req);
    const cart = await GuestCart.findOne({ guestId });

    if (cart) {
        res.status(200).json({ cart: cart.items });
    } else {
        res.status(404).json({ message: 'Cart is empty' });
    }
};

// Clear entire cart for guest user
exports.clearCart = async (req, res) => {
    const guestId = await registerGuest(req);
    await GuestCart.deleteOne({ guestId });
    res.status(200).json({ message: 'Cart cleared' });
};

// Update item quantity in cart for guest user
exports.updateCart = async (req, res) => {
    const { product_id, quantity } = req.body;
    const guestId = await registerGuest(req);

    let cart = await GuestCart.findOne({ guestId });

    const item = cart.items.find(item => item.product_id.toString() === product_id);
    if (item) {
        item.quantity = quantity;
        await cart.save();
        res.status(200).json({ message: 'Cart updated' });
    } else {
        res.status(404).json({ message: 'Item not found in cart' });
    }
};

 