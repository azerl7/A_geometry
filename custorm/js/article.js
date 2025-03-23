async function setCateList(){//获取列表信息
    const res=await axios({
        url:baseUrl+`/pub/getCates`,
    });
    const htmlStr=`<option value="0">分类</option>`+res.data.data.map((item,index)=>{
        return `<option value="${item.id}">${item.name}</option>`;
    }).join('');
    document.querySelector(".sel1").innerHTML=htmlStr;
}
setCateList();
document.querySelector(".face").addEventListener("change",async(event)=>{//获取图片
    const file=event.target.files[0];
    const fd=new FormData();
    fd.append("face",file);
    const res=await axios({
        url:baseUrl+`/atl/uploadface`,
        method:"post",
        data:fd
    });
    console.log(res);
    const imgUrl=res.data.url;
    // const imgUrl="../img/对魔.png";//默认调试地址
    const img=document.querySelector(".faceImg");
    img.src=imgUrl;
    img.classList.remove("hidden1");
    img.classList.add("show1");
    const label=document.querySelector(".faceLabel");
    label.classList.remove("show1");
    label.classList.add("hidden1");
});
document.querySelector(".faceImg").addEventListener("click",()=>{//为图片添加点击事件实现input
    document.querySelector(".face").click();
});

document.querySelector(".submit").addEventListener("click",async(e)=>{//发布文章的逻辑（这里应该可以优化下面的保存状态）
    if(e.target.value!=="发布") return;
    const form=document.querySelector(".articleF");
    const data=serialize(form,{hsah:true,empty:true});
    delete data.aid;
    const imgUrl=document.querySelector(".faceImg").src;
    data.face=imgUrl;
    const {tittle,categories,face,content}=data;
    const res=await axios({
        url:baseUrl+`/atl/publish`,
        method:"post",
        data:{
            tittle,
            cid:categories,
            face,
            content,
            status:"published"//发布状态
        }
    });
    myAlert(res.data.status,res.data.message);
    if(res.data.status===0){//清空数据，方便用户再次发布数据
        form.reset();
        const img=document.querySelector(".faceImg");
        img.src="";
        img.classList.remove("show1");
        img.classList.add("hidden1");
        const label=document.querySelector(".faceLabel");
        label.classList.remove("hidden1");
        label.classList.add("show1");
        editor.setHtml("");
    }
});

document.querySelector(".save").addEventListener("click",async(event)=>{//保存文章的逻辑
    const form=document.querySelector(".articleF");
    const data=serialize(form,{hsah:true,empty:true});
    // delete data.aid;
    const imgUrl=document.querySelector(".faceImg").src;
    data.face=imgUrl;
    // console.log(data);
    const {aid,tittle,categories,face,content}=data;
    // console.log(aid);
    const res=await axios({
        url:baseUrl+`/atl/savedraft`,
        method:"post",
        data:{
            aid,
            tittle,
            cid:categories,
            face,
            content,
            status:"draft"//草稿状态
        }
    });
    console.log(res);
    myAlert(res.data.status,res.data.message);
});
(()=>{
    const params=new URLSearchParams(location.search);
    params.forEach(async (value,key)=>{
        if(key==="aid"){//判断id
            document.querySelector(".tittle1").innerText="修改文章";
            document.querySelector(".submit").value="修改";
            const res=await axios({
                url:baseUrl+`/atl/getArticle`,
                params:{
                    aid:value
                }
            });
            console.log(res);
            const dataObj={//维护对象获取值
                aid:res.data.data.aid,
                sel1:res.data.data.cid,
                tittle:res.data.data.tittle,
                faceImg:res.data.data.face,
                content:res.data.data.content
            };
            Object.keys(dataObj).forEach(key=>{
                if(key==="faceImg"){
                    if(dataObj[key]){
                        const imgUrl=document.querySelector(".faceImg");
                        imgUrl.src=dataObj[key];
                        imgUrl.classList.remove("hidden1");
                        imgUrl.classList.add("show1");
                        const label=document.querySelector(".faceLabel");
                        label.classList.remove("show1");
                        label.classList.add("hidden1");
                    }
                }else if(key==="content"){
                    editor.setHtml(dataObj[key]);
                }else{
                    document.querySelector(`[class=${key}]`).value=dataObj[key];
                }
            });
        }
    });
})();
document.querySelector(".submit").addEventListener("click",async(e)=>{
    if(e.target.value!=="修改") return;
    const form=document.querySelector(".articleF");
    const data=serialize(form,{hsah:true,empty:true});
    // delete data.aid;取消删除
    const imgUrl=document.querySelector(".faceImg").src;
    data.face=imgUrl;
    const {tittle,categories,face,content,aid}=data;
    console.log(data);
    const res=await axios({
        url:baseUrl+`/atl/update`,
        method:"post",
        data:{
            tittle,
            cid:categories,
            face,
            content,
            aid
        }
    });
    console.log(res);
    myAlert(res.data.status,res.data.message);
});