// const token=localStorage.getItem("usersJwt");
document.querySelector(".bg-input").addEventListener("change",(event)=>{
    const fd=new FormData();
    fd.append("img",event.target.files[0]);
    axios({
        url:baseUrl+"/my/uploadimg",
        method:"post",
        data:fd,
        // headers:{
        //     'Authorization': `Bearer ${token}`
        // }
    }).then(result=>{
        // console.log(result);
        const imgUrl=result.data.data.url;
        document.body.style.backgroundImage=`url(${imgUrl})`;
        localStorage.setItem("bgImg",imgUrl);
    }).catch(err=>{
        console.log(err);
    }
    );
});
const bgUrl=localStorage.getItem("bgImg");
bgUrl&&(document.body.style.backgroundImage=`url(${bgUrl})`);
function getCateList(){
    axios({
        url:baseUrl+"/mng/getCateS",
        // headers:{
        //     'Authorization': `Bearer ${token}`
        // }
    }).then(result=>{
        // return console.log(result);      //测试返回，连通等问题
        const cateList=result.data.data;
        const tbody=document.querySelector(".tbody");
        const resStr=cateList.map(
            (item,index)=>{
                return `
                <tr>
                    <td>${index+1}</td>
                    <td>${item.name}</td>
                    <td>${item.description}</td>
                    <td data-id=${item.id}>
                        <span class="delcate">删除</span>
                        <span class="editcate">编辑</span>
                    </td>
                </tr>
                `;
            }
        ).join(' ');
        tbody.innerHTML=resStr;
        console.log(cateList);
    }).catch(err=>{
        console.log(err);
    });
}
getCateList();
const btnSaveEidt=document.querySelector(".saveEidtcate");
const form=document.querySelector(".addcateF");
btnSaveEidt.addEventListener("click",()=>{
    const data=serialize(form,{hash:true,empty:true});
    const {id,name,description}=data;
    // console.log(id,name,description);
    // console.log("test");
    axios({
        url:baseUrl+"/mng/addCate",
        method:"post",
        data:{
            id,
            name,
            description
        },
        // headers:{
        //     'Authorization': `Bearer ${token}`
        // }
    }).then((result)=>{
        // console.log(result);
        getCateList();
        hidden(document.querySelector(".modal_add"));
    }).catch((err)=>{
        console.log(err);
    });
});

const btnAddCate=document.querySelector(".addcate");
const modal0=document.querySelector(".modal_add");
const content=document.getElementsByClassName("content")[0];
btnAddCate.addEventListener("click",()=>{
    const form =document.querySelector(".addcateF");
    form.reset();
    content.classList.remove("pop");
    modal0.style.display='block';
    // console.log(content);
    content.classList.add("pop");
});
const close=document.querySelector(".close");
close.addEventListener("click",()=>{
    modal0.style.display='none';
});
window.onclick=(event)=>{
    if(event.target==modal0){
        modal0.style.display='none';
    }
}

//************************ */

//事件需要绑定在本来就存在的内容上，动态的内容就绑定在其非动态的父级上,防止浏览器报错
//那么如何获取想要实现的目标呢？（event.target）
document.querySelector(".tbody").addEventListener("click",(event)=>{
    if(event.target.classList.contains("delcate")){
        const theId=event.target.parentNode.dataset.id;//获取绑定在父级上的自定义属性
        axios({
            url:baseUrl+`/mng/delCate:id=${theId}`,
            method:"post",
            // headers:{
            //     'Authorization': `Bearer ${token}`
            // }
        }).then(result=>{
            // console.log(result);
            getCateList();
        }).catch(err=>{
            console.log(err);
        });
    }
    if(event.target.classList.contains("editcate")){
        const modal1=document.querySelector(".modal_edit");
        const content1=document.getElementsByClassName("content")[1];
        content1.classList.remove("pop");
        modal1.style.display='block';
        content1.classList.add("pop");
        const close1=document.getElementsByClassName("close")[1];
        close1.addEventListener("click",()=>{
            modal1.style.display='none';
        });
        window.onclick=(event)=>{
            if(event.target==modal1){
                modal1.style.display='none';
            }
        }
        const theId=event.target.parentNode.dataset.id;//从服务器获取信息，保证信息准确性
        axios({
            url:baseUrl+`/mng/getCate:id=${theId}`,
            // headers:{
            //     'Authorization': `Bearer ${token}`
            // }
        }).then(result=>{
            const data=result.data;
            const {description,id,name}=data;
            // 实在想不出优化方法，暴力也是一种美学
            const idInput=document.querySelector(".editidInput");
            const nameInput=document.querySelector(".editnameInput");
            const descriptionInput=document.querySelector(".editdescriptionInput");
            idInput.value=id;
            nameInput.value=name;
            descriptionInput.value=description;
            //下面的不执行不知道为什么
            // const keys=Object.keys(data);
            // console.log(keys);
            // keys.forEach(key=>{
            //     document.querySelector(`.editcateF .${key}`).value=data[key];
            // });
        }).catch(err=>{
            console.log(err);
        });
    }
});

const btnSaveChange=document.querySelector(".editcate");
// console.log(btnSaveChange);
btnSaveChange.addEventListener("click",()=>{
    const id =document.querySelector(".editidInput").value;
    const name=document.querySelector(".editnameInput").value;
    const description=document.querySelector(".editdescriptionInput").value;
    // console.log(id,name,description);
    axios({
        url:baseUrl+`/mng/updateCate:id=${id}`,
        method:"post",
        data:{
            id,
            name,
            description
        },
        // headers:{
        //     'Authorization': `Bearer ${token}`
        // }
    }).then(result=>{
        // console.log(result);
        getCateList();
        hidden(document.querySelector(".modal_edit"));
    }).catch(err=>{
        console.log(err);
    }
    );
});