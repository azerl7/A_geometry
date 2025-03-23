const db=require("../db/mysql");
const query=require("querystring");
const getCateS=(req,res)=>{
    const sqlStr0=`select * from tb_categories where status !="deleted"`;
    db.query(sqlStr0,(err,result)=>{
        if(err) return res.cc(err);
        return res.send({
            status:0,
            message:"获取分类信息成功",
            data:result
        });
    });
}
const getCate=(req,res)=>{
    const data=req.path.split(":");
    const params=query.parse(data[1]);
    const pathId=params.id;
    const sqlStr0=`select * from tb_categories where id=? and status!="deleted"`;
    db.query(sqlStr0,pathId,(err,result)=>{
        if(err)return res.cc(err);
        if(result.length!==1){
            return res.cc("id错误！！！");
        }
        return res.send(result[0]);
    });
}
const addCate=(req,res)=> {
    const cateinfo=req.body;
    const sqlStr0=`insert into tb_categories (name,description) values(?,?)`;
    db.query(sqlStr0,[cateinfo.name,cateinfo.description],(err,result)=>{
        if(err) return res.cc(err);
        if(result.affectedRows!==1) return res.cc("添加分类失败请稍后重试");
        return res.send({
            status:0,
            message:"添加分类成功"
        });
    });
}
const updateCate=(req,res)=>{
    const cateinfo=req.body;
    const sqlStr1=`select * from tb_categories where id=?`;
    db.query(sqlStr1,cateinfo.id,(err,result)=>{
        if(err) return res.cc(err);
        if(result.length!==1) return res.cc("id错误！！！");
        const sqlStr0=`update tb_categories set name=? ,description=? where id=?`;
        db.query(sqlStr0,[cateinfo.name,cateinfo.description,cateinfo.id],(err,result)=>{
            if(err)return res.cc(err);
            if(result.affectedRows!==1){
                return res.cc("修改分类信息失败请稍后重试");
            }
            return res.cc("修改分类信息成功",0);
        });
    });
}
const delCate=(req,res)=>{
    const data=req.path.split(":");
    const params=query.parse(data[1]);
    const pathId=params.id;
    const sqlStr0= `select * from tb_categories where id=?`;
    db.query(sqlStr0,pathId,(err,result)=>{
        if(err) return res.cc(err);
        if(result.length!==1)return res.cc("id错误！！！");
        const sqlStr1=`update tb_categories set status="deleted" where id=?`;
        db.query(sqlStr1,pathId,(err,result)=>{
            if(err)return res.cc(err);
            if(result.affectedRows!==1)return res.cc("删除错误请稍后重试");
            return res.cc("删除成功",0);
        });
    });
}
module.exports={
    getCateS,
    getCate,
    addCate,
    updateCate,
    delCate
}