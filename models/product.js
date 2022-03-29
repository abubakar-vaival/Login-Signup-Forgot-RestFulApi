var mongoose = require("mongoose");
const Joi = require("@hapi/joi");
var productSchema = mongoose.Schema({
    name : String,
    price : Number,
});

var productModel = mongoose.model("product",productSchema);

function validateProduct(data){
    const schema = Joi.object({
        name : Joi.string().min(3).max(20).required(),
        price : Joi.number().min(3).required(),
    });
    return schema.validate(data,{abortEarly:false});
}

module.exports.productModel = productModel;
module.exports.validate = validateProduct;
