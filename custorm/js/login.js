const btn=document.querySelector(".btn");
btn.addEventListener("click",()=>{
    const form=document.querySelector(".login");
    const data=serialize(form,{hash:true,empty:true});
    const {username,password}=data;
    var errtag=0;
    if(username==''){
        const b1=document.querySelector(".b1");
        alertFn("jump",b1,5000);
        errtag=1;
    }
    if(password==''){
        const b2=document.querySelector(".b2");
        alertFn("shake",b2,5000);
        errtag=1;
    }
    if(errtag===1){
        return ;
    }
    console.log(data);
    axios({
        url:baseUrl+"/api/login",
        method:"post",
        data:{
            username,
            password
        }
    }).then(result=>{
        const msg_box=document.querySelector(".msg_box");
        const msg=dealmsg(result.data.message);
        msg_box.innerHTML=msg;
        alertFn("show",msg_box,5000);
        const usersJwt=result.data.data;
        localStorage.setItem("usersJwt",usersJwt);
        setTimeout(()=>{location.href="../index.html"},1500);
        console.log(result.data);
    }).catch(err=>{
        console.log(err);
    });
});