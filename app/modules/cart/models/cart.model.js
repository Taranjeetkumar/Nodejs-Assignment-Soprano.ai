const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    product: [
        {
            productId: {
                type: mongoose.Schema.ObjectId,
                ref: "Product"
            },
            quantity: { type: Number },
        }
    ],
}, {
    timestamps: true
});

module.exports = mongoose.model('cart', cartSchema);