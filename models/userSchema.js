const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    "userId": Number,
    "userName": String,
    "password":String,
    "userEmail":String,//邮箱
    "sex":Number,// 性别0：女，男：1
    "depId":[],//部门
    "job":String,//岗位
    "state":{
        type:Number,
        default:1
    },//1：在职，2：离职，3：试用期
    "roleList":[],//系统角色
    "createTime":{
        type:Date,
        default:Date.now()
    },
    "lastLoginTime":{
        type:Date,
        default:Date.now()
    },
    "mobile": String,
    remark:String
});

module.exports = mongoose.model('users',userSchema,"users");
//代码中名字，表对象，实际表名