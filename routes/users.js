const router = require('koa-router')()
const user = require('../models/userSchema')
const { success, fail } = require('../utils/erroCode')

router.prefix('/users')

router.post('/login', async (ctx, next) => {
  try {
    const { userName, password } = ctx.request.body
    const res = await user.findOne({ userName, password })
    if (res) {
      ctx.body = success(res)
    } else {
      ctx.body = fail('username or password is wrong!')
    }
  } catch (error) {
    ctx.body = fail('query fail because ' + error.msg)
  }
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})

module.exports = router
