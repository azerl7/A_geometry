document.querySelectorAll(".user_barImg").forEach(item=>{
    item.addEventListener("mouseover",()=>{
        if(item.classList.contains("avatar")){
            const origin=item.style.transform;
            // const filter=item.style.filter;//这个模糊设置 有点yinjian哈（冒汗）
            item.style.transform="scale(2)";
            // item.style.filter = 'grayscale(100%)';
            item.addEventListener("mouseleave",()=>{
                item.style.transform=origin;
                // item.style.filter=filter;
            });
        }else{
            item.classList.add("littleJump");
            setTimeout(()=>item.classList.remove("littleJump"),500);
        } 
    });
    item.addEventListener("click",()=>{
        if(item.name!=="loginOut")window.location.href=item.dataset.va;
        else{
            if(localStorage.hasOwnProperty("usersJwt")){
                localStorage.removeItem("usersJwt");
                if(confirm("是否退出登录")){
                    localStorage.removeItem("usersJwt");
                    window.location.href="./index.html";
                }
            }
        }
    });
});

axios({
    url:baseUrl+`/my/getusersinfo`,
}).then(result=>{
    // console.log(result);
    document.querySelector(".avatar").src=result.data.data.avatar;
}).catch(err=>{
    console.dir(err);
});
document.querySelector(".searchInput").addEventListener("input",async(e)=>{
    // console.log(e.target.value);
    const res=await axios({
        url:baseUrl+`/pub/getArticlesTittle`,
        params:{
            tittle:e.target.value
        }
    });
    console.log(res);
    // console.log("hello");
    if(res.data.status===0){
        const htmlStr=res.data.data.map(item=>{
            return `<li class="tittle-item" data-aid="${item.aid}">${item.tittle}</li>`;
        }).join('');
        document.querySelector(".search_list").innerHTML=htmlStr;
        document.querySelector(".search_list").style.display="block";
    }
    else {
        document.querySelector(".search_list").innerHTML='';
        document.querySelector(".search_list").style.display="none";
    }
});
document.querySelector(".search_list").addEventListener("click",(e)=>{
    if(e.target.classList.contains("tittle-item")){
        const aid=e.target.dataset.aid;
        // console.log(aid);
        document.querySelector(".searchInput").value=e.target.innerText;
        window.location.href=`./html/atlcontent.html?aid=${aid}`;
    }
});
//搜索页面跳转
document.querySelector(".searchBtn").addEventListener("click",(e)=>{
    const search=document.querySelector(".searchInput");
    console.log(search.value);
    window.location.href=`./html/search.html?tittle=${search.value}`;
});
document.querySelector(".searchInput").addEventListener("keypress",(e)=>{
    // e.preventDefault();//因为是无用表单所以取消表单提交(可能会影响特殊字符事件)
    //如果该表单没有意义的话那就不写该表单不就好了
    // console.log(e.keycode);
    if(e.key==="Enter"||e.keyCode==108){
        const search=document.querySelector(".searchInput");
        console.log(search.value);
        window.location.href=`./html/search.html?tittle=${search.value}`;
    }
});
// function twoMap(object,roallback){//想要仿照map写一个双对象函数但是失败了。。。
    //     let str;
    //     let index=0;
    //     object.forEach((item)=>{
    //         // console.log(item);//检查数据
    //         str+=roallback(item,index);
    //         index+=1;
    //     });
    //     return str;
    // }
async function getArticleListRandom(){
    const res=await axios({
        url:baseUrl+`/pub/getArticleListRandom`,
    });
    // console.log(res);
    //清空数据确保显示正确
    document.getElementById(`0`).innerHTML="";
    document.getElementById(`1`).innerHTML="";
    res.data.data.map((item,index)=>{
        // console.log(Math.floor(index/2));
        document.getElementById(`${Math.floor(index/2)}`).innerHTML+=`<td class="${index}">
                    <div class="article" data-aid="${item.aid}">
                        <div class="articleImg">
                            <img src="${item.face}" alt="" class="articleImg">
                        </div>
                        <div class="articleTT">
                            <span class="articleTTs">${item.tittle}</span>
                        </div>
                    </div>
                </td>`;
    });
}
getArticleListRandom();
document.querySelector(".flush").addEventListener("click",()=>{
    getArticleListRandom();
});
const arr=document.getElementsByTagName("tr");
// console.log(arr.length);
for(let i=0;i<arr.length;i+=1){
    arr[i].addEventListener("click",(e)=>{
        if(e.target.classList.contains("articleTTs")||e.target.classList.contains("articleImg")){
            // console.log(e.target.parentNode.parentNode);//父节点查找测试
            window.location.href=`./html/atlcontent.html?aid=${e.target.parentNode.parentNode.dataset.aid}`;
        }
    });
}