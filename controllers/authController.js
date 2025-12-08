const User = require("../models/user");
const ApiError = require("../utils/apiError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncWrapper = require("../utils/asyncWrapper");
const NODE_ENV = process.env.NODE_ENV;

const isProduction = NODE_ENV === "production";

const createToken = (payload) => {
    return jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, { expiresIn:'10d' });
}

exports.signup = asyncWrapper(async (req, res, next) => {
    const {email, name, password} = req.body
    const isExist = await User.findOne({ email: email.trim().toLowerCase() })
    console.log(req.body, isExist)
    if(isExist) {
        return next(new ApiError("Email is already in use", 400));
    }
    
    const user = await User.create({name, email:email.trim().toLowerCase(), password})
    return res.status(201).json({ data: user })
});

exports.login = asyncWrapper(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })
    if (!user) return next(new ApiError("Incorrect email or password", 401));

    const isMatch = await bcrypt.compare(req.body.password, user.password)
    if (!isMatch) return next(new ApiError("Incorrect email or password", 401))

    const token = createToken(user._id)
    res.cookie("access_token", token , {
        httpOnly: true,
        secure: isProduction ? true : false,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
        domain: isProduction ? process.env.CLIENT_DOMAIN : "localhost"
    });
    return res.status(200).json({ data: user })

});

exports.logoutCtrl = asyncWrapper(async (req, res) => {
    res.clearCookie("access_token", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
        domain: isProduction ? process.env.CLIENT_DOMAIN : "localhost"
    });

    await res.send({ success: true });
});

exports.getCurrentUserCtrl = asyncWrapper(async (req, res) => {
    const user = await User.findOne({ _id: req.user._id });
    if (!user) return res.status(404).json({ success: false, error: "user not found." })
    await res.status(200).json({ success: true, data: user });
});