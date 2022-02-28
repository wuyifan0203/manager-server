const router = require('koa-router')();
const user = require('../models/userSchema');
const counter = require('../models/counterSchema');
const { success, fail } = require('../utils/erroCode');
const jwt = require('jsonwebtoken');
const priviteKey = require('../config/priviteKey');
const utils = require('../utils/erroCode');
const md5 = require('md5');

router.prefix('/users');

//用户登录
router.post('/login', async (ctx, next) => {
  try {
    const { userName, password } = ctx.request.body;
    const res = await user.findOne({ userName, password }, {
      userId: 1,
      userName: 1,
      userEmail: 1,
      state: 1,
      deotId: 1,
      roleList: 1,
      _id: 0
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

//用户列表
router.get('/list', async (ctx, next) => {
  const { userId, userName, state } = ctx.request.query;
  const { page, skipIndex } = utils.pager(ctx.request.query);
  let params = {};
  if (userId) {
    params.userId = userId;
  }
  if (userName) {
    params.userName = userName;
  }
  if (state && state !== '0') {
    params.state = state;
  }
  try {
    const query = user.find(params, { _id: 0, password: 0 });
    const list = await query.skip(skipIndex).limit(page.pageSize);
    const total = await user.countDocuments(params);
    ctx.body = success({
      page: {
        ...page,
        total
      },
      list
    });
  } catch (error) {
    ctx.body = fail(`query error: ${error.stack}`);
  }
});

//用户新增/编辑
router.post('/operate', async (ctx) => {
  const { userId, userName, userEmail, mobile, job, state, roleList, deptId, action } = ctx.request.body;
  if (action === 'add') {
    if (!userName || !userEmail || !deptId) {
      ctx.body = fail('params error', utils.CODE.PARAM_ERROR);
      return;
    }
   
    const res = await user.findOne({ $or: [{ userName }, { userEmail }] }, '_id userName userEmail');
    if (res) {
      ctx.body = utils.fail('Duplicate user name');
    } else {
      try {
        const doc = await counter.findOneAndUpdate({ _id: 'userId' }, { $inc: { sequence_value: 1 } }, { new: true });
        const userInstance = new user({
          userId:doc.sequence_value,
          userName,
          password:md5('123456'),
          userEmail,
          role:1, //默认普通用户
          roleList,
          job,
          state,
          deptId,
        });
        userInstance.save();
        ctx.body = utils.success('','creat user success!');
      } catch (error) {
        ctx.body = utils.fail(error.stack,'creat user fail!');
      }

    }
  } else {
    if (!deptId) {
      ctx.body = fail('depId != null', utils.CODE.PARAM_ERROR);
      return;
    }
    try {
      const res = await user.findOneAndUpdate({ userId }, { mobile, job, state, roleList, deptId });
      ctx.body = success({}, 'update success');
    } catch (error) {
      ctx.body = fail(error.stack, 'update fail');
    }
  }
});

// 用户删除
router.post('/delete', async (ctx) => {
  const {userIds} = ctx.request.body;
  const res = await user.updateMany({ userId: { $in: userIds } }, { state: 2 });
  console.log(res);
  if (res.nModified) {
    ctx.body = utils.success(res, `共删除成功${res.nModified}条`);
    return;
  }
  ctx.body = utils.fail('删除失败');
});

module.exports = router;