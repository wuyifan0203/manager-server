const mongoose = require('mongoose');

const menuSchema = mongoose.Schema({
    "menuName": String,
    "menuType":Number,
    "menuCode":Number,
    "icon":String,
    "path":String,
    "componet":String,
    "parentId":[mongoose.Types.ObjectId],
    "menuState": Number,//菜单状态
    "createTime":{
        type:Date,
        default:Date.now()
    },
    "lastLoginTime":{
        type:Date,
        default:Date.now()
    }
});

module.exports = mongoose.model('menus',menuSchema,"menus");
//代码中名字，表对象，实际表名