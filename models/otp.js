const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
var bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

var optSchema = mongoose.Schema({
    email : String,
    code : String,
    expireIn : Number,
},
{
    timestamps :true
});

var optModel = mongoose.model("otp",optSchema);

module.exports = optModel;

