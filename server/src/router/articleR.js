const express=require("express");
const router=express.Router();
const articlehandle=require("../handle/articleH");
const upload=require("../middleware/upload");
const schema=require("../schema/article");
const expressJoi=require("@escook/express-joi");
router.post("/uploadface",upload.uploadface.single("face"),articlehandle.resImgUrl);
router.post("/publish",expressJoi(schema.publish_save_schema),articlehandle.publish);
router.post("/del",expressJoi(schema.del_schema),articlehandle.del);
router.get("/getArticles",articlehandle.getArticles);
router.get("/getCates",articlehandle.getCates);
router.get("/getArticle",articlehandle.getArticle);
router.post("/update",articlehandle.update);
router.post("/savedraft",expressJoi(schema.publish_save_schema),articlehandle.savedraft);
module.exports=router;