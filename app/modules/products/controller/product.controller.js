const asyncHandler = require('../../../middleware/async');
const ErrorResponse = require('../../../helper/errorResponse');
const Product = require('../models/product.model');

//@desc Add Products to a subcategory under given Category
//@routes POST /api/V1/products
//@access Private/Admin
exports.createProduct = asyncHandler(async (req, res, next) => {
    var image = req.files;
    let arr = [];
    if (image != null) {
        image.map(result => {
            arr.push(`/static/${result.filename}`);
        });
    }
    req.body.image = arr;

    let productExist = await Product.findOne({ product_name: req.body.product_name });
    if (productExist) {
        return next(new ErrorResponse("This name of product already Exist", 409));
    }
    const product = await Product.create(req.body);

    res.status(200).json({
        success: true,
        data: product
    });
});

//@desc update a product by id 
//@routes PUT /api/V1/products/:id
//@access Private/Admin
exports.updateProduct = asyncHandler(async (req, res, next) => {

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        runValidators: true,
        new: true
    });

    res.status(200).json({
        success: true,
        data: product
    });
});

//@desc Delete a product by id 
//@routes DELETE/api/V1/products/:id
//@access Private/Admin
exports.deleteProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        data: {}
    });
});

//@desc Get all Products via Subcategory
//@routes GET /api/V1/products
//@access Private/Admin
exports.getAllProducts = asyncHandler(async (req, res, next) => {
    const products = await Product.find({});
    console.log(products);

    res.status(200).json({
        success: true,
        count: products.length,
        data: products
    });
});

//@desc Get a Product by id
//@routes GET /api/V1/products/:id
//@access Private/Admin
exports.getProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    console.log(product);

    res.status(200).json({
        success: true,
        data: product
    });
});

