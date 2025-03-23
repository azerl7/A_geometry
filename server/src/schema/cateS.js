const joi=require("joi");
const name=joi.string().required();
const id1=joi.number().allow();
const description=joi.string().allow();
const cate_add_schema={
    body:{
        name,
        id:id1,
        description
    }
}
const name2=joi.string().allow();
const id2=joi.number().allow();
const cate_update_schema={
    body:{
        name:name2,
        id:id2,
        description
    }
}

module.exports={
    cate_add_schema,
    cate_update_schema
}