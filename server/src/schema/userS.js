const joi=require("joi");
const username=joi.string().alphanum().min(3).max(11).required();
const regex= /^[^-#;%_|]*$/;
const password=joi.string().pattern(regex).min(6).max(20).required();
const email=joi.string().email().allow();
const reg_login_schema={
    body:{
        username,
        password,
        email
    }
}

module.exports={
    reg_login_schema
}