const btnFr=document.querySelector(".forget");
const modal=document.querySelector(".modal");
const content=document.querySelector(".content");
btnFr.addEventListener("click",()=>{
    const formRe=document.querySelector(".formRe");
    formRe.reset();
    modal.style.display="block";
    content.classList.add("pop");
});
const close=document.querySelector(".close");
close.addEventListener("click",()=>{
    content.classList.remove("pop");
    modal.style.display="none"
});
window.onclick=(event)=>{
    if(event.target==modal){
        content.classList.remove("pop");
        modal.style.display="none"
    }
}
const btnRe=document.querySelector(".btnRe");
btnRe.addEventListener("click",()=>{
    const formRe=document.querySelector(".formRe");
    const dataRe=serialize(formRe,{hash:true,empty:true});
    const {usn,pwd,pwd1,eml}=dataRe;
    var errtag=0;
    if(usn===''){
        const b2=document.querySelector(".b2");
        alertFn("jump",b2);
        errtag=1;
    }
    if(pwd===''){
        const b1=document.querySelector(".b1");
        alertFn("rotate",b1,5000);
        errtag=1;
    }
    if(eml===''){
        const b3=document.querySelector(".b3");
        alertFn("shake",b3,5000);
        errtag=1;
    }
    if(pwd!==pwd1){
        const b4=document.querySelector(".b4");
        alertFn("squeeze",b4,5000);
        errtag=1;
    }
    if(errtag===1){
        return;
    }
    axios({
        url:baseUrl+"/api/resetpwd",
        method:"post",
        data:{
            username:usn,
            password:pwd,
            email:eml
        }
    }).then(result=>{
        const msg_box=document.querySelector(".msg_box");
        var msg=dealmsg(result.data.message);
        msg_box.innerHTML=msg;
        msg_box.classList.add("show");
        console.log(result);
        setTimeout(()=>{
            msg_box.classList.remove("show");
        },5000);
    }).catch(err=>{
        console.log(err);
        // alert(error.response.data.message);
    });
});