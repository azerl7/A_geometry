const express=require("express");
const router=express.Router();
const expressJoi=require("@escook/express-joi");
const schema=require("../schema/userS");
const userHandle=require("../handle/userH");
router.post("/register",expressJoi(schema.reg_login_schema),userHandle.register);
router.post("/login",expressJoi(schema.reg_login_schema),userHandle.login);
router.post("/resetpwd",expressJoi(schema.reg_login_schema),userHandle.resetpwd);
module.exports=router;