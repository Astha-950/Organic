const Cart = require("../model/cart");  // Corrected from 'cart' to 'Cart' to follow naming conventions
const Buyer = require("../model/buyer");  // Corrected from 'buyer' to 'Buyer'
const mongoose = require('mongoose');

exports.createCart  = async (req, res) => {
    try {
        const { buyer_id, product_id, quantity } = req.body;

        // Find or create a cart for the buyer
        let buyerCart = await Cart.findOne({ buyer_id });

        if (!buyerCart) {
            buyerCart = new Cart({cart_id:null, buyer_id, products: [] });  // Fixed naming to avoid conflict with model
            buyerCart.cart_id=buyerCart._id;
        }

        // Check if product already exists in cart
        const existingProduct = buyerCart.products.find(item =>
            item.product_id.toString() === product_id
        );

        if (existingProduct) {
            existingProduct.quantity += quantity;  // Update quantity
        } else {
            buyerCart.products.push({ product_id, quantity });  // Add new product
        }

        await buyerCart.save();

        res.status(200).json({
            success: true,
            message: "Product added to cart",
            cart: buyerCart
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error adding to cart",
            error: error.message
        });
    }
};

exports.deleteItem = async (req, res) => {
    try {
        const { productId, buyer_id } = req.body;
        const buyerObjectId = new mongoose.Types.ObjectId(buyer_id);
         console.log("productId",productId);
         console.log("buyer_id",buyer_id);
         console.log("buyerObjectId",buyerObjectId);

        // Check if productId and buyer_id are provided
        if (!buyer_id || !productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID and Buyer ID are required"
            });
        }

        // Find and update the cart by pulling the product from the array
        const updatedCart = await Cart.findOneAndUpdate(
            { buyer_id: buyerObjectId },
            { $pull: { products: { product_id: productId } } },
            { new: true }
        );

        if (!updatedCart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found for this buyer"
            });
        }

        // Check if the product was actually removed
        const productRemoved = !updatedCart.products.some(
            (item) => item.product_id.toString() === productId
        );

        if (productRemoved) {
            return res.status(200).json({
                success: true,
                message: "Product deleted successfully from cart",
                cart: updatedCart
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Product not found in the cart for this buyer"
            });
        }
    } catch (error) {
        console.error("Error deleting product:", error.message);
        return res.status(500).json({
            success: false,
            message: "Unable to delete product from cart",
            error: error.message
        });
    }
};

exports.getAllCartItem = async (req, res) => {
    try {
        const { buyer_id } = req.params;
        const buyerObjectId = new mongoose.Types.ObjectId(buyer_id);

        if (!buyerObjectId) {
            return res.status(400).json({
                success: false,
                message: "Buyer ID is required"
            });
        }

        const cartItems = await Cart.findOne({ buyer_id: buyerObjectId })
            .populate({
                path: 'products.product_id',
                select: 'name price productImage'
            });

        if (!cartItems || cartItems.products.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No products found in the cart"
            });
        }

        const formattedItems = cartItems.products.map(item => ({
            product_id: item.product_id._id,
            name: item.product_id.name,
            price: item.product_id.price,
            image: item.product_id.productImage,
            quantity: item.quantity
        }));

        console.log(formattedItems);

        return res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            data: formattedItems
        });
    } catch (error) {
        console.log("Error fetching cart items:", error.message);
        return res.status(500).json({
            success: false,
            message: "Unable to fetch cart items",
            error: error.message
        });
    }
};

exports.updateCart = async (req, res) => {
    try {
        const { product_id, buyer_id, quantity } = req.body;
        const buyerObjectId = new mongoose.Types.ObjectId(buyer_id);

        if (!product_id || !buyerObjectId || !quantity) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        const updatedCart = await Cart.findOneAndUpdate(
            { buyer_id: buyerObjectId, "products.product_id": product_id },
            {
                $set: {
                    "products.$.quantity": quantity
                }
            },
            { new: true }
        ).populate({
            path: 'products.product_id',
            select: 'name price productImage'
        });

        if (!updatedCart) {
            return res.status(404).json({
                success: false,
                message: "Cart item not found for this product and buyer"
            });
        }

        const updatedItem = updatedCart.products.find(item => item.product_id._id.toString() === product_id);

        console.log("Updated Cart Item:", updatedItem);

        return res.status(200).json({
            success: true,
            message: "Cart item updated successfully",
            data: {
                product_id: updatedItem.product_id._id,
                name: updatedItem.product_id.name,
                price: updatedItem.product_id.price,
                image: updatedItem.product_id.productImage,
                quantity: updatedItem.quantity
            }
        });
    } catch (error) {
        console.log("Error updating cart item:", error.message);
        return res.status(500).json({
            success: false,
            message: "Unable to update cart item",
            error: error.message
        });
    }
};
