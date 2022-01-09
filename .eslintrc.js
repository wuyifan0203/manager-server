const { off } = require("./models/userSchema");

module.exports = {
    "env": {
        "node": true,
        "commonjs": true,
        "es2021": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 13
    },
    "rules": {
        'semi': ["error", "always"],
        "no-unused-vars":0,//能有声明后未被使用的变量或参数
    }
};
