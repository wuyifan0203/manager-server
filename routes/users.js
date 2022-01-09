const router = require('koa-router')();
const user = require('../models/userSchema');
const { success, fail } = require('../utils/erroCode');
const jwt = require('jsonwebtoken');
const priviteKey = require('../config/priviteKey');

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
        expiresIn: 3 * 60 * 60  //过期时间，3小时
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

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response';
});

module.exports = router;
