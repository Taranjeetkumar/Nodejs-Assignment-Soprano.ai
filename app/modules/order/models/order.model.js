const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    products_id: [
        {
            productId: { type: mongoose.Schema.ObjectId, ref: 'Product' },
            quantity: { type: Number },
        }
    ],
    status: {
        type: String,
        enum: ['failed', 'pending', 'dispatched', 'placed', 'exchange', 'delievered', 'hold', 'canceled', 'refund', 'received', 'processing'],
        default: "placed",
    },
    instructions: {
        type: String,
    },
    amount: {
        type: Number,
        default: 0,
        required: true,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
},
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Order', OrderSchema);