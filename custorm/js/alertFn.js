function alertFn(name,object,time){
    object.classList.add(name);
    const temp=object.style.zIndex;
    object.style.zIndex=99;
    setTimeout(()=>{
        object.classList.remove(name);
        object.style.zIndex=temp;
    },time);
}

function myAlert(status,message){
    const msg_box=document.querySelector(".msg_box");
    msg_box.innerText=message;
    if(status==0){
        msg_box.style.color="rgba(10,100,10,1)"
        msg_box.style.backgroundColor="rgba(155,255,155,0.7)";
    }
    else{
        msg_box.style.color="rgba(210,10,50,1)";
        msg_box.style.backgroundColor="rgba(200,155,155,1)";
    }
    alertFn("show",msg_box,5000);
}
document.querySelector(".tbody").addEventListener("click",async(e)=>{
    let aid;
    if(e.target.classList.contains("rollback")){
        aid=e.target.parentNode.parentNode.dataset.aid;
        // console.log(e.target.parentNode.parentNode.dataset.aid);
        // console.log(aid);
        const res=await axios({

            url:baseUrl+`/exa/rollback`,
            method:"post",
            data:{
                aid,
            }
        });
        myAlert(res.data.status,res.data.message);
        getArtiles();//刷新状态
        getCates();
    }else if(e.target.classList.contains("accept")){
        aid=e.target.parentNode.parentNode.dataset.aid;
        // console.log(aid);
        const res=await axios({
            url:baseUrl+`/exa/accept`,
            method:"post",
            data:{
                aid,
            }
        });
        myAlert(res.data.status,res.data.message);
        getArtiles();//刷新状态
        getCates();
    }else{//点击到其他部分就跳转
        // console.log(e.target.parentNode.dataset.aid);
        if(e.target.parentNode.dataset.aid){//笑死我了
            aid=e.target.parentNode.dataset.aid;
        }
        else{
            aid=e.target.parentNode.parentNode.dataset.aid
        }
        if(!aid) aid=e.target.parentNode.parentNode.parentNode.dataset.aid;
        // console.log(aid);
        window.location.href=`../html/atlcontent.html?aid=${aid}`;
    }
});