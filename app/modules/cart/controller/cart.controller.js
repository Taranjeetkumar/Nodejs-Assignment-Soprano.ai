const asyncHandler = require('../../../middleware/async');
const ErrorResponse = require('../../../helper/errorResponse');
const Product = require('../../products/models/product.model');
const User = require('../../user/models/user.model');
const Cart = require('../models/cart.model');

//@desc Add Products to a Cart
//@routes POST /api/V1/cart/
//@access Private/Admin
exports.addProductToCart = asyncHandler(async (req, res, next) => {
    let quantity = 1;
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorResponse("There is no any product of given id", 401));
    }
    const cart = await Cart.find({ userId: req.user._id });
    let arr = [];
    let cart1;

    if (cart.length == 0) {
        let obj = {
            productId: product._id,
            quantity: quantity
        }
        arr.push(obj);
        console.log("inside");
        cart1 = new Cart();
        cart1.userId = req.user._id;
        cart1.product = arr;
        cart1.save();
        cart1 = await Cart.findOne({ userId: req.user._id });
        res.status(200).json({
            success: true,
            data: cart1
        });
    }
    else {
        console.log("else ");
        let toggle = true;
        cart1 = await Cart.find({ userId: req.user._id });
        for (let i = 0; i < cart1.length; i++) {
            for (let j = 0; j < cart1[i].product.length; j++) {
                let prodId = product._id.toString();
                let pId = cart1[i].product[j].productId.toString();
                if (prodId == pId) {
                    toggle = false;
                    quantity = cart1[i].product[j].quantity;
                    let obj1 = {
                        _id: cart1[i].product[j]._id,
                        productId: product._id,
                        quantity: quantity
                    };

                    quantity++;
                    let obj = {
                        productId: product._id,
                        quantity: quantity
                    }
                    console.log("obj :", obj);
                    arr.push(obj);
                    console.log("arr : ", arr);
                    var cart2 = await Cart.findOneAndUpdate({ userId: req.user._id }, {
                        $pull: { product: obj1 },
                    });
                    cart2 = await Cart.findOneAndUpdate({ userId: req.user._id }, {
                        $push: { product: arr },
                    });
                    cart2 = await Cart.findOne({ userId: req.user._id });
                }
            }
            if (toggle == true) {
                let obj = {
                    productId: product._id,
                    quantity: quantity
                }
                arr.push(obj);
                console.log("array :", arr);
                var cart2 = await Cart.findOneAndUpdate({ userId: req.user._id }, {
                    $push: { product: arr }
                });
                cart2 = await Cart.findOne({ userId: req.user._id });
            }
        }
        res.status(200).json({
            success: true,
            data: cart2
        });
    }
});

//@desc get Cart
//@routes POST /api/v1/cart/
//@access Private/Admin
exports.getCart = asyncHandler(async (req, res, next) => {
    let cart = await Cart.find({ userId: req.user._id }).populate('product.productId', 'product_name finalprice image');
    if (!cart) {
        return next(new ErrorResponse("Your cart is empty", 401));
    }
    cart = cart[0];
    console.log(cart);
    for (let i = 0; i < cart.product.length; i++) {
        let prices = cart.product[i].productId.finalprice;
        let quantity = cart.product[i].quantity;
        let price = prices * quantity;
        cart.product[i]._doc.price = price;
    }

    res.status(200).json({
        success: true,
        data: cart
    });
});

//@desc Delete Cart
//@routes POST /api/v1/cart/
//@access Private/Admin
exports.deleteCart = asyncHandler(async (req, res, next) => {
    const cart = await Cart.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        data: `cart Deleted`,
    });
});

