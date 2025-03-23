const express=require("express");
const router=express.Router();
const userinfoHandle=require("../handle/userinfoH");
const expressJoi=require("@escook/express-joi");
const path=require("path");
const upload= require("../middleware/upload");
const schema=require("../schema/img");
router.post("/avatar",upload.uploadavatar.single("avatar"),userinfoHandle.avatar);
router.get("/getusersinfo",userinfoHandle.getusersinfo);
router.post("/updateusersinfo",userinfoHandle.updateusersinfo);
router.get("/isMng",userinfoHandle.isMng);

module.exports=router;