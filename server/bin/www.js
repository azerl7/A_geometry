const PORT=7274;
const www=require("../app");

www.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`);
    console.log("Hello world!");
});