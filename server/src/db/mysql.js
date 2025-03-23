const mysql=require("mysql2");
const db=mysql.createPool({
    host:"127.0.0.1",
    user:"root",
    password:"062690",
    database:"geometry_db_02"
});

module.exports=db;