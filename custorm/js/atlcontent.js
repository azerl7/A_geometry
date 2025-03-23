function getTime(date){
    const TimeStr=`${date.getFullYear()}-${date.getMonth()}-${date.getDay()}  ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    return TimeStr;
}
async function getArticle(aid=1){
    const res=await axios({
         url:baseUrl+`/atl/getArticle`,
         params:{
             aid
         }
    });
    console.log(res);//查看文章返回信息
    const data=res.data.data;
    document.querySelector(".face").src=data.face;
    document.querySelector(".tittle").innerText=data.tittle;
    document.querySelector(".content").innerHTML=data.content;
    const Cdate=new Date(data.created_at);
    const Udate=new Date(data.updated_at);
    document.querySelector(".created_at").innerText=`创建于${getTime(Cdate)}`;
    document.querySelector(".updated_at").innerText=`上一次修改于${getTime(Udate)}`;
}
const params=new URLSearchParams(location.search);
let aid;
params.forEach((value,key)=>{
    if(key==="aid"){
        aid=value;
        return;
    }
});
console.log(aid);
getArticle(aid);