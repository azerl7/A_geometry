const db=require("../db/mysql");
const query=require("querystring");
const avatar=(req, res) => {
    if (!req.file) return res.cc("没有文件上传");
    //先把更新之前的头像路径拿到，并删除，节约存储空间
    const sqlStr1=`select avatar from tb_users where uid=?`;
    db.query(sqlStr1,req.user.id,(err,result)=>{
        if(err) return res.cc(err);
        if(result.length!==1) return res.cc("头像查找失败");
        if(result[0].avatar=="http://127.0.0.1:7274/imgs/avatar/geometry.jpg") {
            const fileUrl = `http://127.0.0.1:7274/imgs/avatar/${req.file.filename}`; 
            const sqlStr0=`update tb_users set avatar=? where uid=?`;
            db.query(sqlStr0,[fileUrl,req.user.id],(err,result)=>{
                if(err) return res.cc(err);
                if(result.affectedRows!==1) return res.cc("更新用户头像失败");
                return res.status(200).json({ 
                    status:0,
                    message: '文件上传成功',
                    data: {
                        url: fileUrl
                    }
                });
            }); 
        }
        else {
            const path=require("path");
            const filename=result[0].avatar.split("/")[4];
            const filepath=path.join(__dirname,'../../public/imgs/avatar',filename);
            // return res.cc(filepath);    //包装头像文件路径
            const fs=require("fs");
            fs.unlink(filepath,(err)=>{
                if(err) return res.cc(err);
                const fileUrl = `http://127.0.0.1:7274/imgs/avatar/${req.file.filename}`; 
                const sqlStr0=`update tb_users set avatar=? where uid=?`;
                db.query(sqlStr0,[fileUrl,req.user.id],(err,result)=>{
                    if(err) return res.cc(err);
                    if(result.affectedRows!==1) return res.cc("更新用户头像失败");
                    return res.status(200).json({ 
                        status:0,
                        message: '文件上传成功',
                        data: {
                            url: fileUrl
                        }
                    });
                }); 
            });
        }
    });
}

const getusersinfo=(req,res)=>{
    const id=req.user.id;
    const sqlStr0=`select email,nickname,avatar,udesc from tb_users where uid=?`;
    db.query(sqlStr0,id,(err,result)=>{
        if(err) return res.cc(err);
        if(result.length!==1) return res.cc("查询用户失败，请稍后重试");
        return res.send({
            status:0,
            message:"查询用户成功",
            data:result[0]
        });
    });
}

const updateusersinfo=(req,res)=>{
    const id=req.user.id;
    const info=req.body;
    const sqlStr0=`update tb_users set email=?,nickname=?,udesc=? where uid=?`;
    db.query(sqlStr0,[info.email,info.nickname,info.udesc,id],(err,result)=>{
        if(err) return res.cc(err);
        if(result.affectedRows!==1) return res.cc("更新失败请稍后重试");
        return res.cc("更新成功",0);
    });
}

const isMng=(req,res)=>{
    const id=req.user.id;
    const sqlStr0=`select * from tb_managers where uid=?`;
    db.query(sqlStr0,id,(err,result)=>{
        if(err) return res.cc(err);
        if(result.length!==1) return res.cc("管理员失效");
        return res.send({
            status:0,
            message:"管理员确认"
        });
    });
}
module.exports={
    avatar,
    getusersinfo,
    updateusersinfo,
    isMng
}