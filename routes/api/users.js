const express = require("express");
var router = express.Router();
let {userModel} = require("../../models/user");
const validateUser = require("../../middlewares/validateuser");
const validateuserLogin = require("../../middlewares/validateuserlogin");
var bcrypt = require("bcryptjs");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const config = require("config");
const authx = require("../../middlewares/auth");
const admin = require("../../middlewares/admin");
let {emailsend,changepassword} = require("../../middlewares/optprocedure");
const optmodel = require("../../models/otp");
const nodemailer = require("nodemailer");
//for sign-up
router.post("/register",validateUser,async (req,res)=>{
    let user = await userModel.findOne({email : req.body.email});
    if(user)
    {
        return res.status(400).send("Email already exists");
    }
    user = new userModel();
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;
    await user.generateHashedPassword();
    await user.save();
    return res.send(_.pick(user,["name","email"]));
});

//for login
router.post("/login",validateuserLogin,async (req,res)=>{
    let user = await userModel.findOne({email : req.body.email});
    if(!user)
    {
        return res.status(400).send("User Not Registered");
    }
    let isvalid = await bcrypt.compare(req.body.password,user.password);
    if(!isvalid)
    {
        return res.status(401).send("Invalid Password");
    }
    let token = jwt.sign({_id:user._id,name:user.name},config.get("jwtPrivateKey"));
    res.send(token);
    
});

router.get("/",authx,async (req,res)=>{
    let user = await userModel.find();
    return res.send(user);
});

router.get("/:id",authx,async (req,res)=>{
    let user = await userModel.findById(req.params.id);
    return res.send(user);
});

router.post("/",authx,admin,validateUser,async (req,res)=>{
    let user = await userModel.findOne({email : req.body.email});
    if(user)
    {
        return res.status(400).send("Email already exists");
    }
    user = new userModel();
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;
    await user.generateHashedPassword();
    await user.save();
    return res.send(_.pick(user,["name","email"]));
});

router.put("/:id",authx,admin,validateUser,async (req,res)=>{
    let user = await userModel.findById(req.params.id);
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;
    await user.generateHashedPassword();
    await user.save();
    return res.send(_.pick(user,["name","email"]));
});

router.delete("/:id",authx,admin,async(req,res)=>{
    let user = await userModel.findByIdAndDelete(req.params.id);
    return res.send(user);
});

router.post("/email-sent",async (req,res)=>{
    let user = await userModel.findOne({email : req.body.email});
    if(user)
    {
        let otpcode = Math.floor((Math.random()*10000)+1);
        let otp = new optmodel();
            otp.email = req.body.email;
            otp.code = otpcode;
            otp.expireIn = new Date().getTime() + 300*1000;
        let otpresponse = await otp.save();
        
        return res.send(otpresponse);
        // mailer(opt.email,opt.code); //this will be used when using actual email-id for now were using dummy email id's
    }else{
        return res.send("Error");
    }
    // res.status(200).send(response);
});

router.post("/change-password",async(req,res)=>{
    let otp = await optmodel.find({email:req.body.email, code : req.body.code});
    if(otp)
    {
        let currenttime = new Date().getTime();
        let diff = otp.expireIn - currenttime;
        if(diff<0)
        {
            return res.send("Token Expired");
        }
        else
        {
            let user = await userModel.findOne({email : req.body.email});
            user.password = req.body.password;
            await user.generateHashedPassword();
            await user.save();
            return res.status(200).send("Password Changed Succeddfully");

        }
    }else{
        return res.status(401).send("Invalif Opt");
    }
});

//function used when we have actual mail and we need to send email to authentic mails. for now were using dummy mails
// const mailer = (email,otp)=>{
//     var transporter = nodemailer.createTransport({
//         service : "gmail",
//         port : 587,
//         secure : false,
//         auth :{
//             user : "abubakar@gmail.com",
//             pass : "abubakar",
//         }
//     });
//     var mailoptions = {
//         from : 'abubakar@gmail.com',
//         to : '',
//         subject : 'Sending Email using nodejs',
//         text : 'ThankYou Sir !',
//     };

//     transporter.sendMail(mailoptions,function(error,info){
//         if(error)
//         {
//             console.log(error);
//         }
//         else
//         {
//             console.log("Email sent" + info.response);
//         }
//     });

// };




module.exports = router;