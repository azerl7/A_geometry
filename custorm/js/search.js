const searchPath=location.href.split("?")[1];
const params=new URLSearchParams(searchPath);
const pageCnf={//需要维护的页面对象
    page:1,
    page_size:8,
    count:0,
    allpage:0
}
params.forEach((value,key)=>{
    document.querySelector(".searchInput").value+=value;
});//需要优先于获取文章处理以免页面跳转时的错误
async function getArticles(tittle=""){
    document.getElementById("0").innerHTML="";//清除以前的数据确保显示正确
    document.getElementById("1").innerHTML="";
    if(tittle==""){//如果为空就不进行搜索，并不给出提示（用户是知道的）
        // console.log("test");
        return ;
    }
    const res=await axios({
        url:baseUrl+`/pub/getArticles`,
        params:{
            tittle,
            pageCnf
        }
    });
    const data=res.data;
    // console.log(data);//获取结果格式判断
    pageCnf.count=data.count;
    pageCnf.allpage=Math.ceil(pageCnf.count/pageCnf.page_size);
    if(data.data){//有返回数据就进行显示
        data.data.map((item,index)=>{
            document.getElementById(`${Math.floor(index/4)}`).innerHTML+=`
            <td>
                <div class="article" data-aid="${item.aid}">
                    <div class="articleImg">
                        <img src="${item.face}" alt="" class="articleImg">
                    </div>
                    <div class="articleTT">
                        <span>${item.tittle}</span>
                    </div>
                </div>
            </td>`;
        });
        document.querySelector(".all_page").innerText=`共${pageCnf.count}条/共${pageCnf.allpage}页`;
        myAlert(res.data.status,"搜索成功");
    }
    else if(res.data.message=="Illegal argument to a regular expression."||res.data.message=="查询错误"){//没有搜索到结行提示
        myAlert(res.data.status,"请试试别的搜索");
    }
}
getArticles(document.querySelector(".searchInput").value);//通过首页的搜索框进行的初始化搜索
document.querySelector(".searchBtn").addEventListener("click",(e)=>{
    // console.log(event);
    const tittle=document.querySelector(".searchInput").value
    getArticles(tittle);
});
document.querySelector(".searchInput").addEventListener("keypress",(e)=>{
    if(e.key==="Enter") {
        const tittle=document.querySelector(".searchInput").value
        getArticles(tittle);
    }
});
const arr=document.getElementsByTagName("tr");
// console.log(arr.length);
for(let i=0;i<arr.length;i+=1){
    arr[i].addEventListener("click",(e)=>{
        if(e.target.classList.contains("articleTTs")||e.target.classList.contai("articleImg")){
            // console.log(e.target.parentNode.parentNode);//父节点查找测试
            window.location.href=`../html/atlcontent.html?aid=${e.target.parentNodparentNode.      dataset.aid}`;
        }
    });
}
document.querySelector(".last").addEventListener("click",()=>{
    if(pageCnf.page>1){
        pageCnf.page-=1;
        const tittle=document.querySelector(".searchInput").value;
        getArticles(tittle);
        document.querySelector(".now_page").innerText=`第${pageCnf.page}页`;
    }
});
document.querySelector(".next").addEventListener("click",()=>{
    if(pageCnf.page<pageCnf.allpage){
        pageCnf.page+=1;
        const tittle=document.querySelector(".searchInput").value;
        getArticles(tittle);
        document.querySelector(".now_page").innerText=`第${pageCnf.page}页`;
    }
});