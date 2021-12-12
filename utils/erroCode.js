import  log4js  from "./log4js";
const CODE = {
    SUCCESS:200,
    PARAM_ERROR:10001,//参数错误
    USER_ACCOUNT_ERROR:20001,//账号或密码错误
    USER_LOGIN_ERROR:30001,//用户未登录
    BUSINESS_ERROR:40001,//业务请求失败
    AUTH_ERROR:50001,//token过期
}
module.exports ={
    pager({pageNum=1,pageSize=10}){
        pageNum=Number(pageNum);
        pageSize=Number(pageSize);
        const skipIndex = (pageNum-1)*pageSize;
        return{
            page:{
                pageSize,
                pageNum
            },
            skipIndex
        }
    },
    success(data='',msg='',code=CODE.SUCCESS){
        log4js.debug(data);
        return{
            code,
            data,
            msg
        }
    },
    fail(msg='',code=CODE.BUSINESS_ERROR){
        log4js.debug(msg);
        return{
            code,
            msg
        }

    }
}