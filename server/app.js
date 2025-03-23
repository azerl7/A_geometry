const express=require("express");
const app=express();
const cors=require("cors");
app.use(cors());
app.use(express.json());//处理前端发送过来的json数据
app.use(express.urlencoded({extended:false}));//处理前端发送过来的的x-www-form-urlencoded数据
const path=require("path");
app.use(express.static(path.join(__dirname,"public")));
const error=require("./cnf/error");
app.use(error.errorCc);//格式化处理错误需要放在开始
const expressJWT=require("express-jwt");
const config=require("./cnf/config");
app.use(expressJWT({secret:config.jwtSecretkey}).unless({path:[/^\/api/]}));//去除/api的token验证
const userRouter=require("./src/router/userR");
app.use("/api",userRouter);
const cateRouter=require("./src/router/cateR");
const exaRouter=require("./src/router/examine");
const {isMng}=require("./src/middleware/isMng");
// app.use("/mng",isMng);
app.use("/mng",isMng,cateRouter);
app.use("/exa",isMng,exaRouter);
// app.use("/public",cateRouter);
const userinfo=require("./src/router/userinfoR");
app.use("/my",userinfo);
const article=require("./src/router/articleR");
app.use("/atl",article);
const PubRouter=require("./src/router/PubR");
app.use("/pub",PubRouter);

app.use(error.errorPub);//全局错误处理需要放在最后

module.exports=app;
