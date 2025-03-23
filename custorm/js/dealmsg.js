function dealmsg(msg) {
    if (typeof msg !== 'string') {
        return "未知错误,请联系管理员";
    }
    const type = msg.charAt(2); // 根据输出确定是哪一种错误
    console.log(type);
    switch(type) {
        case 'u':
            res = "账号不能小于3位或者高于11位";
            break;
        case 'a':
            res = "密码不能小于6位或者高于20位";
            break;
        case 'm':
            res="邮箱格式不正确";
            break;
        case 'p':
            res="该邮箱已被使用";
            break;
        default:
            res = msg;
    }
    return res;
}