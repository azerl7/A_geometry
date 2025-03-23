const joi=require("joi");
const { JsonWebTokenError } = require("jsonwebtoken");
const errorCc=(req,res,next)=>{
    res.cc=(err,status=1)=>{
        res.send({
            status,
            message:err instanceof Error? err.message:err
        });
    }
    next();
}

const errorPub=(err,req,res,next)=>{
    if(err instanceof joi.ValidationError) return res.cc(err.message);
    if(err.name==="UnauthorizedError") return res.cc("身份认证失败");
    // next();这里不需要next中间件的原因是因为这个是错误处理函数而且上面的都是不可处理错误，需要保留服务器程
    // 序，避免传入错误数据导致服务器崩溃
}

module.exports={
    errorCc,
    errorPub
};