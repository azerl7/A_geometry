// const token=localStorage.getItem("usersJwt");
const moren=baseUrl+"/imgs/geometry.jpg";
axios({
    url:baseUrl+`/my/getusersinfo`,
    // headers:{
    //     'Authorization': `Bearer ${token}`
    // },
}).then(result=>{
    console.log(result);
    const userObj=result.data.data?result.data.data:{space:"null"};
    Object.keys(userObj).forEach((key,index)=>{
        if(key=="avatar"){
            document.querySelector(`.avatarimg`).src=userObj[key];
        }
        else if(document.querySelector(`.${key}`)) document.querySelector(`.${key}`).value=userObj[key]?userObj[key]:"占时没有";
    })
}).catch(err=>{
    console.log(err);
});
document.querySelector(".avatarInput").addEventListener("change",(event)=>{
    const fd=new FormData();
    fd.append("avatar",event.target.files[0]);
    axios({
        url:baseUrl+"/my/avatar",
        method:"post",
        data:fd,
    }).then(result=>{
        console.log(result);
        const imgUrl=result.data.data.url;
        document.querySelector(".avatarimg").src=imgUrl?imgUrl:moren;
    }).catch(err=>{
        console.log(err);
    });
});
document.querySelector(".submit").addEventListener("click",()=>{
    const form=document.querySelector(".usersinfoF");
    const data=serialize(form,{hash:true,empty:true});
    // console.log(data);//查看输出格式
    const {email,udesc,nickname}=data;
    axios({
        url:baseUrl+"/my/updateusersinfo",
        method:"post",
        data:{
            email,
            nickname,
            udesc
        }
    }).then(result=>{
        myAlert(result.data.status,result.data.message);
    }).catch(err=>{
        console.log(err);
    });
});
async function isMng(){
    const res=await axios({
       url:baseUrl+`/my/isMng`,
    });
    console.log(res);
    if(res.data.message=="管理员确认"){
       document.querySelector(".admin_box").style.display="block";
    }
}
document.querySelector("#cateMng").addEventListener("click",()=>{
    window.location.href="../html/categories.html";
});
document.querySelector("#allAtl").addEventListener("click",()=>{
    window.location.href="../html/examine.html";
});
isMng();