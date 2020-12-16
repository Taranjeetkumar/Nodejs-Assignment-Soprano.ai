const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: String,
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    phone: {
        type: String,
        allowNull: true,
        match: [/^\d{10}$/, 'Please add a valid mobile number']
    },
    password: {
        type: String,
        minlength: 6,
        required: function () {
            return !(this.isFacebook || this.isGoogle);
        },
    },

}, {
    timestamps: true,
});

// //Encrypt password using bcryptjs
// UserSchema.pre('save',async function(next){
//     const salt=await bcrypt.genSalt(10);
//     this.password=await bcrypt.hash(this.password,salt);
// });

//Sign JWT and return 
UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

//Match user entered password to hasheed password in database(will return T or F)
UserSchema.methods.matchPassword = async function (enteredPassword) {
    console.log("Entered Password : ", enteredPassword);
    console.log(this.password);
    return await bcrypt.compare(enteredPassword, this.password);
}

//Match user entered otp to hashed otp inside the database(will return T or F)
UserSchema.methods.matchOtp = async function (enteredOtp, user) {
    console.log("Enter Otp:", enteredOtp);
    return await bcrypt.compare(enteredOtp, this.otpCode);
}

module.exports = mongoose.model('User', UserSchema);