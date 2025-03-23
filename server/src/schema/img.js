const joi=require("joi");

const avator=joi.string().dataUri().required();
const id=joi.number().required();
const uploadimg_schema={
    body:{
        avator
    }
}
const uploadavator_schema={
    body:{
        avator,
        id
    }
}
module.exports={
    uploadimg_schema,
    uploadavator_schema
}