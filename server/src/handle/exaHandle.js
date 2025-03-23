const db=require("../db/mysql");

const getallexa=(req,res)=>{
    let sqlStr0=`select * from tb_examine where status="examine" and cid=?`;
    const cid=req.query.cid;
    if(cid==0)sqlStr0=`select * from tb_examine where status="examine"`;
    db.query(sqlStr0,cid,(err,result)=>{
        if(err) return res.cc(err);
        if(result.length==0) return res.cc("没有需要审核的文章");
        return res.send({
            status:0,
            message:"获取信息成功",
            data:result
        });
    });
}

const getallcate=async(req,res)=>{
    const sqlStr0=`select id,name from tb_categories where id in(select cid from tb_examine where status="examine")`;
    db.query(sqlStr0,(err,result)=>{
        if(err) return res.cc(err);
        if(result.length==0) return res.cc("没有查询到分类信息");
        return res.send({
            status:0,
            message:"获取分类信息成功",
            data:result
        });
    });
}
const rollback=async(req,res)=>{//来了，折磨人之路
    const aid=Number(req.body.aid);
    // return res.cc(aid);
    const sqlStr0=`update tb_article set status="draft" where aid=?`;
    db.query(sqlStr0,aid,(err,result)=>{
        if(err) return res.cc(err);
        if(result.affectedRows!==1) return res.cc("打回失败");
        const SqlStr1=`delete from tb_examine where aid=?`;
        db.query(SqlStr1,aid,(err,result)=>{
            if(err) return res.cc(err);
            if(result.affectedRows!==1) return res.cc("打回时从申请表上删除失败");
            return res.cc("打回成功",1);
        });
    });
}

const accept=(req,res)=>{
    const aid=Number(req.body.aid);
    // return res.cc(aid);
    const sqlStr0=`update tb_article set status="published" where aid=?`;
    db.query(sqlStr0,aid,(err,result)=>{
        if(err) return res.cc(err);
        if(result.affectedRows!==1) return res.cc("接受失败");
        const SqlStr1=`delete from tb_examine where aid=?`;
        db.query(SqlStr1,aid,(err,result)=>{
            if(err) return res.cc(err);
            if(result.affectedRows!==1) return res.cc("接受时从申请表上删除失败");
            return res.cc("接受成功",0);
        });
    });
}

module.exports={
    getallexa,
    getallcate,
    rollback,
    accept
}