const db=require("../db/mysql");

const resImgUrl=(req,res)=>{
    if (!req.file) return res.cc("没有文件上传");
    const fileUrl = `http://127.0.0.1:7274/imgs/face/${req.file.filename}`;
    return res.send({
        status:0,
        message:"上传图像成功",
        url:fileUrl
    });
}
const publish=(req,res)=>{
    const atlinfo=req.body;
    const uid=req.user.id;
    const sqlTran=`start transaction`;
    const sqlRoll=`rollback`;
    const sqlSub=`commit`;
    db.query(sqlTran,(err,result)=>{
        if(err) console.log("事务开启错误");
        const sqlStr0=`insert into tb_article(tittle,cid,uid,content,face,status) value(?,?,?,?,?,"examine") `;
        db.query(sqlStr0,[atlinfo.tittle,atlinfo.cid,uid,atlinfo.content,atlinfo.face],(err,result)=>{
            if(err) {db.query(sqlRoll);return res.cc(err);}
            if(result.affectedRows!==1){db.query(sqlRoll); return res.cc("发布失败");}
            // db.query(sqlSub);//如果是嵌套结构只需要最后一次提交即可
            // db.query(sqlSub);//如果是嵌套结构只需要最后一次提交即可
            let aid;
            const sqlStr1=`select aid from tb_article where tittle=?`;
            db.query(sqlStr1,atlinfo.tittle,(err,result)=>{
                if(err) {db.query(sqlRoll);return res.cc(err);}
                if(result.length!==1){db.query(sqlRoll); return res.cc("发布失败");}
                aid=result[0].aid;
                const sqlStr2=`insert into tb_examine value(?,?,?,?,"examine",now())`;
                db.query(sqlStr2,[aid,atlinfo.cid,atlinfo.tittle,atlinfo.face],(err,result)=>{
                    if(err) {db.query(sqlRoll);return res.cc(err);}
                    if(result.affectedRows!==1){db.query(sqlRoll); return res.cc("发布失败");}
                    db.query(sqlSub);
                    return res.cc("发布成功等待管理管审核",0);
                });
            });
        });
        db.query(sqlSub);//每执行一句就必须提交一次
    });//开启事务

}
const getArticles=async(req,res)=>{
    const uid=req.user.id;
    const sqlStr0=`create view  vi_article as select * from tb_article where uid=?`;
    const params=req.query;
    params.page=Number(params.page);
    params.page_size=Number(params.page_size);
    // return res.cc(params);//检查params
    db.query(sqlStr0,uid,(err,result)=>{
        if(err) return res.cc(err);
        // if(result.affectedRows===0) return res.send({//未知小错误
        //     status:3,
        //     message:"该用户没有任何文章",
        //     data:result
        // });
        ///////*********************************** */
        let sqlStr1;
        let object;
        if(params.status==""&&params.cid==""){
            sqlStr1=`select * from vi_article where status!="deleted"`;
            object=[(params.page-1)*params.page_size,params.page_size];
        }
        else if(params.status==""&&params.cid!==""){
            sqlStr1=`select * from vi_article where cid=? and status!="deleted"`;
            object=[params.cid,(params.page-1)*params.page_size,params.page_size];
        }
        else if(params.status!==""&&params.cid==""){
            sqlStr1=`select * from vi_article where status=?`;
            object=[params.status,(params.page-1)*params.page_size,params.page_size];
        }
        else {
            sqlStr1=`select * from vi_article where status=? and cid=?`;
            object=[params.status,params.cid,(params.page-1)*params.page_size,params.page_size];
        }
        // return res.cc(object);
        // const affLength=result.affectedRows;
        db.query(sqlStr1,object,(err,result)=>{
            const sqlStr2=`drop view if exists vi_article`;    //异步原因，选择使用嵌套，因为链式还不太会
            db.query(sqlStr2,(err,result)=>{
                if(err) console.log(err);
                // console.log(result);
            });
            if(err) return res.cc(err);
            // return res.cc(result);
            const totalCount=result.length;
            if(result.length==0) return res.send({
                status:3,
                message:"没有任何文章",
                data:"",
                totalCount,
                // allLength:affLength//这里也要传是因为用户的文章一共有这么多
            });
            //分页处理
            //为什么不在上面分页？？？（使用mysql计数来减轻mysql查询的时间？）
            //因为当时没有想到
            const answer=result.slice((params.page-1)*params.page_size,params.page*params.page_size);
            return res.send({
                status:0,
                message:"获取用户文章成功",
                data:answer,
                totalCount,
                // allLength:affLength//传递所有文章的条数
            });
        });
        // return res.send({//查看返回数据格式
        //     data:result
        // });
    });
}
const getCates=(req,res)=>{//返回用户创作过的分类
    const uid=req.user.id;
    const sqlStr0=`select * from tb_categories where id in( select cid from tb_article where uid=?)`;
    db.query(sqlStr0,uid,(err,result)=>{
        if(err) return res.cc(err);
        if(result.length===0) return res.send({
            status:0,
            message:"该用户好像没有参与分类创作哦",
            data:["",""]
        });
        return res.send({
            status:0,
            message:"获取分类成功",
            data:result
        });
    });
}

const del=(req,res)=>{
    const atlinfo=req.body;
    const sqlStr1=`select aid from tb_article where aid=?`;
    db.query(sqlStr1,atlinfo.aid,(err,result)=>{
        if(err) return res.cc(err);
        if(result.length!==1) return res.cc("数据传输错误请稍后重试");
        const sqlStr0=`update tb_article set status="deleted" where aid=?`;
        db.query(sqlStr0,atlinfo.aid,(err,result)=>{
            if(err) return res.cc(err);
            if(result.affectedRows!==1) return res.cc("删除失败请稍后重试");
            return res.send({
                status:0,
                message:"删除成功",
                data:result
            });
        });
    });
}

const getArticle=(req,res)=>{
    const aid=req.query.aid;
    const sqlStr0=`select * from tb_article where aid=? and status!="deleted"`;
    db.query(sqlStr0,aid,(err,result)=>{
        if(err) return res.cc(err);
        if(result.length!==1) return res.cc("数据传输有误，请稍后重试");
        return res.send({
            status:0,
            message:"获取文章信息成功",
            data:result[0]
        });
    });
}

const update=(req,res)=>{
    const atlinfo=req.body;
    const sqlStr0=`select * from tb_article where aid=?`;
    const sqlTran=`start transaction`;
    const sqlRoll=`rollback`;
    const sqlSub=`commit`;
    db.query(sqlTran,(err,result)=>{
        if(err) {
            console.log("xiao");
            return res.cc(err);
        }
        db.query(sqlStr0,atlinfo.aid,(err,result)=>{
            if(err){
                db.query(sqlRoll,(err,result)=>{});
                return res.cc(err);
            } 
            else{
                db.query(sqlSub,()=>{});
            }
            if(result.length!==1) return res.cc("数据传输有误，请稍后重试");
            const sqlStr1=`update tb_article set content=?,face=?,tittle=?,status="examine",updated_at=now() where aid=?`;
            db.query(sqlStr1,[atlinfo.content,atlinfo.face,atlinfo.tittle,atlinfo.aid],(err,result)=>{
                if(err){
                    db.query(sqlRoll,(err,result)=>{});
                    return res.cc(err);
                } 
                else{
                    db.query(sqlSub,()=>{});
                }
                if(result.affectedRows!==1) return res.cc("修改失败");
                const sqlStr3=`select aid from tb_examine where aid=?`;
                db.query(sqlStr3,atlinfo.aid,(err,result)=>{
                    if(err) return res.cc(err);
                    if(result.length==0){//没有该aid就进行插入，有就进行删除
                        const sqlStr2=`insert into tb_examine value(?,?,?,?,"examine",now())`;
                        db.query(sqlStr2,[atlinfo.aid,atlinfo.cid,atlinfo.tittle,atlinfo.face],(err,result)=>{
                            if(err){
                                db.query(sqlRoll,(err,result)=>{});
                                return res.cc(err);
                            } 
                            else{
                                db.query(sqlSub,()=>{});
                            }
                            // console.log(result);//服务器处理
                            if(result.affectedRows!==1)return res.cc("更新错误");
                            return res.cc("更新成功等待管理员审核",0);
                        });
                    }
                    else{
                        const sqlStr2=`update tb_examine set tittle=?,face=?,status="examine",time=now() where aid=?`;
                        db.query(sqlStr2,[atlinfo.tittle,atlinfo.face,atlinfo.aid],(err1,result1)=>{
                            if(err1){
                                db.query(sqlRoll,(err,result)=>{});
                                return res.cc(err1);
                            } 
                            else{
                                db.query(sqlSub,()=>{});
                            }
                            // console.log(result1);//服务器处理
                            if(result1.affectedRows!==1)return res.cc("更新错误");
                            return res.cc("更新成功等待管理员审核",0);
                        });
                    }
                })
            });
        });
        db.query(sqlSub,()=>{});
    });
}
const savedraft=(req,res)=>{//保存会把该文章状态修改为draft（草稿状态）
    const atlinfo=req.body;
    // return res.cc(atlinfo.aid);//主要表单验证,会把数据拿掉
    if(atlinfo.aid!==""){//根据aid内容来判断这次的保存该如何处理
        // return res.cc(atlinfo.aid);
        const sqlStr0=`select * from tb_article where aid=?`;
        db.query(sqlStr0,atlinfo.aid,(err,result)=>{
            // return res.cc("ok");//断点测试？？？
            if(err) return res.cc(err);
            if(result.length!==1) return res.cc("数据传输有误，请稍后重试");
            const sqlStr1=`update tb_article set cid=?,content=?,face=?,tittle=?,status="draft",updated_at=now() where aid=?`;
            db.query(sqlStr1,[atlinfo.cid,atlinfo.content,atlinfo.face,atlinfo.tittle,atlinfo.aid],(err,result)=>{
                // return res.cc(atlinfo.cid);
                if(err) return res.cc(err);
                if(result.affectedRows!==1) return res.cc("保存失败");
                return res.send({
                    status:0,
                    message:"保存成功"
                });
            });
        });
    }
    else{
        const sqlStr1=`insert into tb_article(cid,content,face,tittle,status) vaule(?,?,?,?,"draft")`;
        db.query(sqlStr1,[atlinfo.cid,atlinfo.content,atlinfo.face,atlinfo.tittle],(err,result)=>{
            if(err) return res.cc(err);
            if(result.affectedRows!==1) return res.cc("保存失败");
            return res.cc("保存成功",0);
        });
    }
}

module.exports={
    resImgUrl,
    publish,
    getArticles,
    getArticle,
    getCates,
    del,
    update,
    savedraft
}