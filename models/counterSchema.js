/**
 * 用户ID自增
 */
const mongoose = require('mongoose');

const counterSchema = mongoose.Schema({
    _id: String,
    sequence_value: Number,
});

module.exports = mongoose.model('counter', counterSchema, 'counter');
//代码中名字，表对象，实际表名