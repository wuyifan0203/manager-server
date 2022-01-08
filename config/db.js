const mongoose = require('mongoose')
const config = require('./index')
const log4js = require('./../utils/log4js')

mongoose.connect(config.URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const db = mongoose.connection;

db.on('error',()=>{
    log4js.error('****database connect fail****')
})

db.on('open',()=>{
    log4js.info('****database connect success!****')
})
