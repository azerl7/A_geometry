const express=require("express");
const router=express.Router();
const exaHandle=require("../handle/exaHandle");
router.get("/allexa",exaHandle.getallexa);
router.get("/allcate",exaHandle.getallcate);
router.post("/rollback",exaHandle.rollback);
router.post("/accept",exaHandle.accept);

module.exports=router