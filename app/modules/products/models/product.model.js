const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    product_name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    finalprice: {
        type: Number,
        required: true
    },
    tax: {
        type: Number,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
    },
    product_title: {
        type: String,
    },
    quantity: {
        type: Number,
    },
    stock_status: {
        type: Boolean,
    },
    weight: {
        type: String,
        required: true,
    },
    manufacture_country: {
        type: String,
    },
    image: [{
        type: String,
    }],
    description: {
        type: String,
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);