const express=require("express");
const router=express.Router();

const handle=require("../handle/PubH");
router.get("/getCates",handle.getCates);
router.get("/getArticles",handle.getArticles);
router.get("/getArticleListRandom",handle.getArticleListRandom);
router.get("/getArticlesTittle",handle.getArticlesTittle);

module.exports=router;