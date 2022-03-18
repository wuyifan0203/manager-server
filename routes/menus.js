const router = require('koa-router')();
const menu = require('../models/menuSchema');
const { success, fail } = require('../utils/erroCode');
const utils = require('../utils/erroCode');


router.prefix('/menu');

//菜单获取
router.get('/list',async(ctx)=>{
    try {
        const { menuState,menuName } = ctx.request.query;
        const queryParams = {};
        if(menuName){
            queryParams.menuName = menuName;
        }
        if(menuState){
            queryParams.menuState = menuState;
        }
        const res = await menu.find(queryParams) || [];
        const permissionList = getTreeMenu(res,null,[]);
        ctx.body = utils.success(permissionList);
    } catch (error) {
        ctx.body = utils.fail('get menu list fail'+ error.stack);
    }
});

function getTreeMenu(rootList,id,list) {
    for(let i = 0;i<rootList.length;i++){
        const item = rootList[i];
        if(String(item.parentId.slice().pop())===String(id)){
            list.push(item._doc);
        }
    }
    list.map((item)=>{
        item.children = [];             
        getTreeMenu(rootList,item._id,item.children);
        if(item.children.length===0){
            delete item.children;
        }else if(item.children.length>0 && item.children[0].menuType === 2){
            item.action = item.children;
        }
    });
    return list;
}


//菜单操作（编辑，新增，删除）
router.post('/operate', async (ctx) => {
    try {
        const { _id, action, ...params } = ctx.request.body;
        let info;
        if (action === 'add') {
            await menu.create(params);
        } else if (action === 'edit') {
            params.updatetime = new Date();
            await menu.findByIdAndUpdate(_id, params);
        } else if (action === "delete") {
            await menu.findByIdAndRemove(_id);
            await menu.deleteMany({parentId:{$all:[_id]}});
        }
        info = action + 'success';
        ctx.body = utils.success('', info);
    } catch (error) {
        ctx.body = utils.fail(error.stack);
    }

});

module.exports = router;