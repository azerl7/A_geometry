const joi=require("joi");

const tittle=joi.string().required();
const content=joi.string().required();
const face=joi.string().required();
const cid=joi.number().required();
const aid1=joi.number().allow();
const status=joi.string().allow();
const publish_save_schema={
    body:{
        aid:aid1,
        tittle,
        content,
        face,
        cid,
        status
    }
}
const aid=joi.number().required();
const del_schema={
    body:{
        aid
    }
}
module.exports={
    publish_save_schema,
    del_schema
}