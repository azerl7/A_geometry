const token=localStorage.getItem("usersJwt");
const path=location.href.split("/");
const endPath=path[path.length-1];
// console.log(endPath);//消除index页面的跳转错误
let href1="../html/login.html";
if(endPath==="index.html") href1="./html/login.html";
if(!token){
    location.href=href1;
} 

axios.interceptors.request.use((config)=>{
    const token=localStorage.getItem("usersJwt");
    token && (config.headers.Authorization=`Bearer ${token}`);
    return config;
},(err)=>{
    return Promise.reject(err);
});

axios.interceptors.response.use((response)=>{
    if(response.data.message==="身份认证失败"){
        alert("身份认证失败");
        localStorage.clear();
        window.location.href=href1;
    }else if(response.data.message==="用户不是管理员"){
        alert("用户不是管理员");
        window.location.href=href1;
    }
    return response;
},(err)=>{
    console.dir(err);
    // console.log("ok");如果后端有了错误处理，可能不会进入这个
    if(err?.data?.message==="身份认证失败"){
        alert("身份认证失败");
        localStorage.removeItem("usersJwt");
        window.location.href=href1;
    }
    return Promise.reject(err);
});