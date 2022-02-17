const router = require('koa-router')();
const user = require('../models/userSchema');
const { success, fail } = require('../utils/erroCode');
const jwt = require('jsonwebtoken');
const priviteKey = require('../config/priviteKey');
const utils = require('../utils/erroCode');

router.prefix('/users');

router.post('/login', async (ctx, next) => {
  try {
    const { userName, password } = ctx.request.body;
    const res = await user.findOne({ userName, password },{
      userId:1,
      userName:1,
      userEmail:1,
      state:1,
      deotId:1,
      roleList:1,
      _id:0
    });
    const data = res._doc;

    const token = jwt.sign(
      {
        data: data,
      },
      priviteKey,
      {
        expiresIn: '3h'  //过期时间，3小时
      }
    );

    if (res) {
      data.token = token;
      ctx.body = success(data);
    } else {
      ctx.body = fail('username or password is wrong!');
    }
  } catch (error) {
    ctx.body = fail('query fail because ' + error.msg); 
  }
});

// router.get('/list', async (ctx, next) =>{
//   const {userId, userName, state} = ctx.request.query;
//   const {page,skipIndex} = utils.pager(ctx.request.query);
//   let params = {};
//   if(userId){
//     params.userId = userId;
//   }
//   if(userName){
//     params.userName = userName;
//   }
//   if(state && state !== '0'){
//     params.state = state;
//   }
//   try {
//     const query = user.find(params,{_id:0,password:0});
//     const list = await query.skip(skipIndex).limit(page.pageSize);
//     const total = await user.countDocuments(params);
//     ctx.body = utils.success({
//       page:{
//         ...page,
//         total
//       },
//       list
//     });
//   } catch (error) {
//     ctx.body = utils.fail(`query error: ${error}`);
//   } 


// )};
module.exports = router;