const db=require("../db/mysql");

const getCates=(req,res)=>{
    // return res.cc("ok");
    const sqlStr0=`select * from tb_categories`;
    db.query(sqlStr0,(err,result)=>{
        if(err) return res.cc(err);
        if(result.length===0) return res.cc("查询错误");
        return res.send({
            status:0,
            message:"获取分类信息成功",
            data:result
        });
    });
}

const getArticles=(req,res)=>{
    const tittle=req.query.tittle;
    const page=req.query.pageCnf.page;
    const page_size=req.query.pageCnf.page_size;
    const sqlStr0=`select * from tb_article where status="published" and tittle regexp ? limit ${(page-1)*page_size},${page_size}`;
    db.query(sqlStr0,tittle,(err,result)=>{
        if(err) return res.cc(err);
        if(result.length===0) return res.cc("查询错误");
        const sqlStr1=`select count(1) as num  from tb_article where status="published" and tittle regexp ?`;
        let totalCount=0;
        db.query(sqlStr1,tittle,(err,result1)=>{
            // if(err) return res.cc(err);只要上面没有错误，这里就不可能出现错误，直接进行逻辑即可
            // // if(result.length)
            totalCount=Number(result1[0].num);
            // console.log(result1[0].num);
            // console.log(totalCount+"!");
            return res.send({
                status:0,
                message:"获取文章信息成功",
                data:result,
                count:totalCount
            });
        });
        
    });
}
const getArticleListRandom=(req,res)=>{
    const sqlStr0=`select * from tb_article where status="published" order by rand(now()) limit 4`;
    db.query(sqlStr0,(err,result)=>{
        if(err)return res.cc(err);
        if(result.length==0) return res.cc("获取错误");
        return res.send({
            status:0,
            message:"获取文章成功",
            data:result
        });
    });
}
const getArticlesTittle=(req,res)=>{
    const tittle=req.query.tittle;
    const sqlStr0=`select * from tb_article where status="published" and tittle regexp ?`;
    db.query(sqlStr0,tittle,(err,result)=>{
        if(err) return res.cc(err);
        if(result.length==0)return res.cc("没有该标题的文章");
        return res.send({
            status:0,
            message:"获取标题成功",
            data:result
        });
    });
}

module.exports={
    getCates,
    getArticles,
    getArticleListRandom,
    getArticlesTittle
}