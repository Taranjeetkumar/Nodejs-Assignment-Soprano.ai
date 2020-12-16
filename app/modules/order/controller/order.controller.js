const asyncHandler = require('../../../middleware/async');
const ErrorResponse = require('../../../helper/errorResponse');
const Product = require('../../products/models/product.model');
const Cart = require('../../cart/models/cart.model');
const Order = require('../models/order.model');
const User = require('../../user/models/user.model');
const { sendMail } = require('../../../helper/sendMail');

//@desc Order Create
//@routes POST/api/v1/order/create
//@access Public 
exports.orderCreate = asyncHandler(async (req, res, next) => {
    req.body.user_id = req.user._id;

    const cart = await Cart.find({ userId: req.user._id });
    if (!cart) {
        return next(new ErrorResponse(`User Cart is empty`, 404));
    }
    let products = cart[0].product;
    req.body.products_id = products;
    req.body.status = "placed";

    let cost = await calculatepayment(cart);
    req.body.amount = cost;
    const order = await Order.create(req.body);

    for (let i = 0; i < products.length; i++) {
        const cart1 = await Cart.findByIdAndUpdate(cart._id, {
            $pull: { product: products[i] }
        })
    }
    const products1 = products;
    for (let i = 0; i < products1.length; i++) {
        const product = await Product.findById(products1[i].productId);
        let quantity = Number(product.quantity);
        let quantity1 = products1[i].quantity;
        const product1 = await Product.findByIdAndUpdate(products1[i].productId, {
            quantity: quantity - quantity1,
        })
    }
    res.status(200).json({
        success: true,
        order: order,
    });
});

let calculatepayment = async (cart) => {
    if (!cart) {
        return next(new ErrorResponse(`Your cart is empty`, 401));
    }
    let tax = 0;
    let price = 0;
    console.log(cart);
    for (let i = 0; i < cart.length; i++) {
        for (let j = 0; j < cart[i].product.length; j++) {

            for (let k = 0; k < cart[i].product[j].quantity; k++) {
                let productid = cart[i].product[j].productId;
                const product = await Product.findById(productid);
                price = price + product.finalprice;
                tax = tax + product.tax;
            }
        }
    }
    let totalcost = price;
    let cost = totalcost + (totalcost * tax / 100);
    return cost;
}

//@desc Order Listing
//@routes POST/api/v1/order/list
//@access Public 
exports.orderList = asyncHandler(async (req, res, next) => {
    const order = await Order.find({});

    res.status(200).json({
        success: true,
        order: order,
    });
});

//@desc Order details
//@routes POST/api/v1/order/details
//@access Public 
exports.orderDetails = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new ErrorResponse(`Order is not Found With id ${req.params.id}`, 401));
    }
    res.status(200).json({
        success: true,
        order: order,
    });
});

//@desc Order delete
//@routes POST/api/v1/order/delete
//@access Public 
exports.orderDelete = asyncHandler(async (req, res, next) => {
    const order = await Order.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        order: "order Deleted",
    });
});

//@desc get Payment
//@routes POST /api/v1/cart/pay
//@access Private/Admin
exports.checkout = asyncHandler(async (req, res, next) => {
    const order = await Order.find({ _id: req.params.id });
    if (!order) {
        return next(new ErrorResponse(`Your cart is empty`, 401));
    }
    let price = 0;
    let tax = 0;
    let discountprice = price;
    let discount = 0;
    console.log(order);
    for (let i = 0; i < order.length; i++) {
        for (let j = 0; j < order[i].products_id.length; j++) {
            for (let k = 0; k < order[i].products_id[j].quantity; k++) {
                let productid = order[i].products_id[j].productId;
                const product = await Product.findById(productid);
                price = price + product.finalprice;
                console.log(price);
                tax = tax + product.tax;
            }
        }
    }
    discountprice = price;

    console.log(price);
    let totalcost = price;
    let data = {
        ActualCost: price,
        discountprice: discount,
        Afterdiscountprice: discountprice,
        tax: `${tax}%`,
        AfterTax: `${totalcost + (totalcost * tax / 100)}`,
        BeforeTax: `${discountprice}`,
        taxRs: `${totalcost * tax / 100}`
    }
    console.log("data : ", data);

    res.status(200).json({
        success: true,
        data: data
    });
});
