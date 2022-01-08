const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const log4js = require('./utils/log4js')
const router = require('koa-router')()

// const index = require('./routes/index')
const users = require('./routes/users')

// error handler
onerror(app)
require('./config/db')

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  if(ctx.method.toUpperCase === 'POST'){
    log4js.info(`post params:${JSON.stringify(ctx.request.body)}`)
  }else{
    log4js.info(`get params:${JSON.stringify(ctx.request.query)}`) 
  }
  
  await next()

  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
router.prefix('/api')
router.use(users.routes(), users.allowedMethods())
// app.use(index.routes(), index.allowedMethods())
app.use(router.routes(),router.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  log4js.error(`${err.stack}`)
});

module.exports = app
