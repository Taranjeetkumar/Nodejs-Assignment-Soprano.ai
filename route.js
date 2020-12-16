const user_route = require('./app/modules/user/routes/user.route');
const product_route = require('./app/modules/products/routes/product.route');
const cart_route = require('./app/modules/cart/routes/cart.route');
const order_route = require('./app/modules/order/routes/order.route');


module.exports = [
    {
        path: '/api/v1/user',
        handler: user_route
    },
    {
        path: '/api/v1/product',
        handler: product_route
    },
    {
        path: '/api/v1/cart',
        handler: cart_route
    },
    {
        path: '/api/v1/order',
        handler: order_route
    },
]