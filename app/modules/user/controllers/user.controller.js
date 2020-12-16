const { msg } = require('../../../../config/message');
const asyncHandler = require('../../../middleware/async');
const ErrorResponse = require('../../../helper/errorResponse');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const { sendMail } = require('../../../helper/sendMail');
const {
    pickLoginResponse,
    pickRegistrationResponse,
    pickUserProfileResponseInSocial,
    pickSocialResponse
} = require('../../../helper/pickResponse.helper');

generateRandomCode = () => Math.floor(100000 + Math.random() * 900000);

module.exports.test = function (req, res) {
    res.status(200).json({
        success: true,
        data: "Welcome"
    })
}

// @desc    Register User
// @route   POST/api/v1/user/register
// access    Public
exports.postregister = asyncHandler(async (req, res, next) => {
    let { name, email, phone, password, ConfirmPassword } = req.body;
    if (!/^[A-Za-z]+/.test(name)) throw { type: "name", error: "invalid name" };
    if (!password) throw { type: "password", error: "password cannot be empty" };
    if (password == ConfirmPassword) {
        const salt = await bcrypt.genSalt(10);
        let pass = password.toString();
        const hashedPassord = await bcrypt.hash(pass, salt);

        let userExist = await User.findOne({ email: email });
        if (userExist) {
            return next(new ErrorResponse(msg.duplicatePhoneOrEmail, 401));
        }
        var response = await User.create({
            name: name,
            email: email,
            password: hashedPassord,
            phone: phone,
        });
    }
    else {
        return next(new ErrorResponse("Password and Confirm Password are not Same", 401));
    }
    let message = `Hi, You are registered`;
    let email1 = await sendMail(email, message);
    const token = response.getSignedJwtToken();//create token
    res.status(200).json({
        success: true,
        data: await pickRegistrationResponse(response),
        token
    });
});

// @desc    Login User
// @route   POST/api/v1/user/login
//access    Public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    let pass = password;
    if (!email || !password) {//validate phone and password
        return next(new ErrorResponse(msg.noPhoneOrPassword, 400));
    }
    const user = await User.findOne({ email }).select('+password');//check for user
    if (!user) {
        return next(new ErrorResponse(msg.unauthorizedLogin, 401));
    }
    const isMatch = await user.matchPassword(pass);//model method to match the hashed password with the password user has provided
    if (!isMatch) {
        return next(new ErrorResponse(msg.unauthorizedLogin, 401));
    }
    console.log("match :", isMatch);
    const token = await user.getSignedJwtToken();
    res.status(200).json({
        success: true,
        data: await pickLoginResponse(user),
        token
    });
});

