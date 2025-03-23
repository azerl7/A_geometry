const express=require("express");
const router=express.Router();
const schema=require("../schema/cateS");
const expressJoi=require("@escook/express-joi");
const cateH=require("../handle/cateH");
router.get("/getCateS",cateH.getCateS);
router.get("/getCate:id",cateH.getCate);
router.post("/addCate",expressJoi(schema.cate_add_schema),cateH.addCate);
router.post("/updateCate:id",expressJoi(schema.cate_update_schema),cateH.updateCate);
router.post("/delCate:id",expressJoi(schema.cate_update_schema),cateH.delCate);

module.exports=router;