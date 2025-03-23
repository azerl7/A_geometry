const btn=document.querySelector(".btn");
btn.addEventListener("click",()=>{
    const form=document.querySelector(".register");
    const data=serialize(form,{hash:true,empty:true});
    const {username,password,password1,email}=data;
    // console.log(data);
    var errtag=0;
    if(username===''){
        const jump=document.getElementById("01");
        alertFn("jump",jump,5000);
        errtag=1;
    }
    if(password===''){
        const shake=document.getElementById("02");
        alertFn("shake",shake,5000);
        errtag=1;
    }
    if(email===''){
        const rotate=document.getElementById("04");
        alertFn("rotate",rotate,5000);
        errtag=1;
    }
    if(password!==password1){
        const squeeze=document.getElementById("03");
        alertFn("squeeze",squeeze,5000);
        errtag=1;
    }
    if(errtag===1){
        return;
    }
    // console.log("username:"+count.value,"password:"+pwd0.value,"email:"+email.value);
    axios({
        url:baseUrl+"/api/register",
        method:"post",
        data:{
            username,
            password,
            email
        }
        //1xx表示信息
        //2xx表示成功
        //3xx表示重定向消息
        //4xx表示客户端错误
        //5xx表示服务端错误
    }).then(result=>{
        const msg_box=document.querySelector(".msg_box");
        var msg=dealmsg(result.data.message);
        msg_box.innerHTML=msg;
        alertFn("show",msg_box,5000);
    }).catch(error=>{
        alert(error.response.data.message);
    });
});