const multer=require("multer");
const path=require("path");
const uploadavatar= multer({
    dest: path.join(__dirname,'../../public/imgs/avatar'), // 设置上传文件的保存目录(相对于js文件的路径)
    filename: function (req, file) {
        // 自定义文件名，这里使用时间戳和原文件名
        const timestamp = new Date().toISOString();
        return timestamp+""+file.originalname;
    }
});

const uploadface=multer({
    dest: path.join(__dirname,'../../public/imgs/face'), // 设置上传文件的保存目录(相对于js文件的路径)
    filename: function (req, file) {
        // 自定义文件名，这里使用时间戳和原文件名
        const timestamp = new Date().toISOString();
        return timestamp+""+file.originalname;
    }
});

const upload={
    uploadavatar,
    uploadface
};
module.exports=upload;