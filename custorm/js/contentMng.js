const queryObj={
    status:"",//文章状态
    cid:"",///分类ID
    page:1,//当前页码
    page_size:2//当前页面条数
}
async function setArtileList(){
    const res=await axios({
        url:baseUrl+`/atl/getArticles`,
        // method:"post",
        params:queryObj
    });
    // console.log(res);检查结果
    if(res.data.status!==0){
        myAlert(res.data.status,res.data.message);
        return;
    }
    const htmlStr=res.data.data.map((item,index)=>{
        switch(item.status){
            case "published":item.status="发布";break;
            case "draft":item.status="草稿";break;
            case "examine":item.status="审核";break;
        }
        const date=new Date(item.created_at);
        item.created_at=date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
        return `<tr>
                <td>
                    <div class="img_box">
                        <img src="${item.face}" class="content_face">
                    </div>
                </td>
                <td>
                    ${item.tittle}
                </td>
                <td class="status">${item.status==='发布'?`<span class='blue'>${item.status}</span>`:`<span>${item.status}</span>`}</td>
                <td>${item.created_at}</td>
                <td data-id="${item.aid}">
                    <span class="delatl">删除</span>
                    <span class="editatl">编辑</span>
                </td>
            </tr>`;
    }).join("");
    document.querySelector(".tbody").innerHTML=htmlStr;
    //保存文章总条数
    totalCount=res.data.totalCount;
    document.querySelector(".all_page").innerText=`共${totalCount}条 共${Math.ceil(totalCount/queryObj.page_size)}页`;
}
async function setCateList(){//获取列表信息
    const res=await axios({
        url:baseUrl+`/atl/getCates`,
    });
    // console.log(res);检查返回结果
    const htmlStr=`<option value="">分类</option>`+res.data.data.map((item,index)=>{
        return `<option value="${item.id}">${item.name}</option>`;
    }).join('');
    document.querySelector(".sel1").innerHTML=htmlStr;
}
document.querySelectorAll(".status").forEach(radio=>{
    radio.addEventListener("change",e=>{
        queryObj.status=e.target.value;
        console.log(queryObj);
    });
});
document.querySelector(".sel1").addEventListener("change",e=>{
    queryObj.cid=e.target.value;
    console.log(queryObj);
});

document.querySelector(".filter").addEventListener("click",(e)=>{
    // const form =document.querySelector(".content_choice");    //方便后面的页面切换//不嫌麻烦也可以多写
    // const data=serialize(form,{hash:true,empty:true});
    // console.log(data);
    // queryObj.cid=data.categories;
    // queryObj.status=data.status;
    // console.log(queryObj);
    setArtileList();
});
setCateList();
setArtileList();
let totalCount=0;//文章总条数
document.querySelector(".next").addEventListener("click",(e)=>{
    if(queryObj.page<Math.ceil(totalCount/queryObj.page_size)){//判断临界值
        queryObj.page+=1;
        document.querySelector(".now_page").innerText=`第${queryObj.page}页`;
        setArtileList();
    }
});
document.querySelector(".last").addEventListener("click",(e)=>{
    if(queryObj.page>1){//判断临界值
        queryObj.page-=1;
        document.querySelector(".now_page").innerText=`第${queryObj.page}页`;
        setArtileList();
    }
});
document.querySelector(".tbody").addEventListener("click",async(e)=>{
    if(e.target.classList.contains("delatl")){
        const delId=e.target.parentNode.dataset.id;
        // console.log(delId);//测试点击结果
        const res=await axios({
            url:baseUrl+`/atl/del`,
            method:"post",
            data:{
                aid:delId
            }
        });
        // console.log(res);//查看结果
        const children=document.querySelector(".tbody").children;
        if(children.length==1&&queryObj.page!==1){
            queryObj.page-=1;
            document.querySelector(".now_page").innerText=`第${queryObj.page}页`;
        }
        setArtileList();
    }
});
document.querySelector(".tbody").addEventListener("click",async(e)=>{
    if(e.target.classList.contains("editatl")){
        const aid=e.target.parentNode.dataset.id;
        location.href=`../html/article.html?aid=${aid}`;
    }
});