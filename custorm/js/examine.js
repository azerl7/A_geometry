const selectChoice={
    cid:0,
}
async function getCates(){
    const res=await axios({
        url:baseUrl+`/exa/allcate`,
    });
    console.log(res);//测试返回结果
    const htmlStr=res.data.data.map((item)=>{
        return `<option name="status" value="${item.id}">${item.name}</option>`;
    }).join("");
    document.querySelector(".sel").innerHTML+=htmlStr;
}
async function getArtiles(){
    const res=await axios({
        url:baseUrl+`/exa/allexa`,
        // method:"post"
        params:{
            cid:selectChoice.cid
        }
    });
    // console.log(res);//测试返回格式
    const data=res.data.data;
    console.log(data);
    const htmlStr=data.map((item,value)=>{
        const date=new Date(item.time);
        return `<tr data-aid="${item.aid}">
                <td>
                    <div class="img_box">
                        <img src="${item.face}" class="content_face">
                    </div>
                </td>
                <td>
                    ${item.tittle}
                </td>
                <td class="status">
                    <span>${(item.status=="examine")?"审核":"奇怪状态"}</span>
                </td>
                <td>
                    ${date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getMinutes()}
                </td>
                <td>
                    <span class="rollback">打回</span>
                    <span class="accept">通过</span>
                </td>
            </tr>`;
    }).join("");
    document.querySelector(".tbody").innerHTML=htmlStr;
}
getArtiles();
getCates();
document.querySelector(".cateS").addEventListener("change",(e)=>{
    selectChoice.cid=e.target.value;
    // console.log(selectChoice.cid);
    getArtiles();
});