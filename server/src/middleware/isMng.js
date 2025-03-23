const db=require("../db/mysql");

function isMng(req,res,next){
    const id=req.user.id;
    const sqlStr0=`select * from tb_managers where uid=?`;
    // return res.cc(id);//返回传入结果
    db.query(sqlStr0,id,(err,result)=>{
        // return res.cc(result);
        if(err) return res.cc(err);
        if(result.length!==1) return res.cc("用户不是管理员");
        next();    //通过监测之后才进入下面的处理
    });
}

module.exports={
    isMng
}