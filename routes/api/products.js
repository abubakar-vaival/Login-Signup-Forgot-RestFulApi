const express = require("express");
var router = express.Router();
var {productModel,validate} = require("../../models/product");
const validateproduct = require("../../middlewares/validateproduct"); 
const auth = require("../../middlewares/auth");
const admin = require("../../middlewares/admin");

//insert product
router.post("/",auth,validateproduct,async (req,res)=>{
    let products = new productModel();
    products.name = req.body.name;
    products.price = req.body.price;
    await products.save();
    return res.send(products);
});

//get all products
router.get("/",async (req,res)=>{
    let page = Number(req.query.page? req.query.page :1);
    let perpage = Number(req.query.perpage?req.query.perpage:10);
        let skiprecords = (perpage*(page-1)); 
    let products = await productModel.find().skip(skiprecords).limit(perpage);
    return res.send(products);
});

//get single products
router.get("/:id",async (req,res)=>{
    try{
    let products = await productModel.findById(req.params.id);
    if(!products)
    {
        return res.status(400).send("Product with given ID is not present");
    }
    return res.send(products);
    } catch (err){
        return res.status(400).send("Invalid ID");
    }
});

//update product
router.put("/:id",auth,admin,validateproduct,async (req,res)=>{
    let products = await productModel.findById(req.params.id);
    products.name = req.body.name;
    products.price = req.body.price;
    await products.save();
    return res.send(products);
});

//delete product
router.delete("/:id",auth,admin,async (req,res)=>{
    let products = await productModel.findByIdAndDelete(req.params.id);
    return res.send(products);
});

module.exports = router;