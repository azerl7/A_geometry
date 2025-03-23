const db =require("../db/mysql");
const bcryptjs=require("bcryptjs");
const jwt=require("jsonwebtoken");
const cnf=require("../../cnf/config");
const register=(req,res)=>{
    const userinfo=req.body;
    const sqlStr0=`select * from tb_users where username=?`;
    db.query(sqlStr0,userinfo.username,(err,result)=>{
        if(err) return res.cc(err);
        if(result.length>=1){
            return res.cc("该账号已经存在");
        }
        userinfo.password=bcryptjs.hashSync(userinfo.password,Math.floor(Math.random(10)+1));//随机盐长度
        const sqlStr1=`insert into tb_users (username,password,email) value(?,?,?)`;//为了方便直接插入对象，所以要求前端的命名按照后端数据的字段名称来
        db.query(sqlStr1,[userinfo.username,userinfo.password,userinfo.email],(err,result)=>{
            if(err) return res.cc(err);
            if(result.affectedRows!==1)return res.cc("注册失败请稍后重试");    //这里可能会调用事务请注意
            return res.cc("注册成功",0);
        });
    });
};
const login=(req,res)=>{
    const userinfo=req.body;
    const sqlStr0=`select * from tb_users where username=?`;
    db.query(sqlStr0,userinfo.username,(err,result)=>{
        if(err) return res.cc(err);
        if(result.length!=1)return res.cc("登录失败请稍后重试");
        const compareSync=bcryptjs.compareSync(userinfo.password,result[0].password);
        if(!compareSync){
            return res.cc("账号或者密码错误请稍后重试");
        }
        // console.log(result[0].id);
        const user={id:result[0].uid,password:"******",avator:""};//暂时不使用头像
        const token=jwt.sign(user,cnf.jwtSecretkey,{expiresIn:cnf.expiresIn});
        return res.send({
            status:0,
            message:"登录成功",
            data:token,
            test:result[0].uid
        });
    });
}

const resetpwd=(req,res)=>{
    const userinfo=req.body;
    const sqlStr0= `select * from tb_users where email=? and username=?`;
    db.query(sqlStr0,[userinfo.email,userinfo.username],(err,result)=>{
        if(err) return res.cc(err);
        if(result.length!==1) return res.cc("邮箱和账号不匹配");
        const sqlStr1=`update  tb_users set password=? where username=? `;
        userinfo.password=bcryptjs.hashSync(userinfo.password,Math.floor(Math.random(10)+1));
        db.query(sqlStr1,[userinfo.password,userinfo.username],(err,result)=>{
            if(err) return res.cc(err);
            if(result.affectedRows!==1) return res.cc("更新密码错误请稍后重试");
            return res.cc("更新密码成功",0);
        });
    });
}

module.exports={
    register,
    login,
    resetpwd
}