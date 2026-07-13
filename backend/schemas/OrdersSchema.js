const { Schema } = require("mongoose");

const OrdersSchema = new Schema({
    // Define your order schema fields here
    name: String,
    qty: Number,
    price: Number,
    mode: String, // e.g., "BUY" or "SELL"
});

module.exports = { OrdersSchema };

