var express = require("express");
var router = express.Router();
const authorization = require('../modules/authorization');

// 获取业务模块
var usersServ = require('../services/usersService');

router.use(function (req, res, next) {
  // .. some logic here .. like any other middleware
  next()
})

router.post('/login',
  // 参数校验
  (req, res, next) => {
    // console.log(req.body, "res.body");
    next();
  },
  // 业务逻辑
  (req, res) => {
    const { loginStr, pwd } = req.body;
    usersServ.login(
      loginStr,
      pwd,
      (err, loginResult) => {
        if (err) {
          return res.sendResult(null, 500, err);
        }
        if (!loginResult || !loginResult.length || loginResult.length == 0) {
          return res.sendResult(null, 404, '登录失败，请检查登录账户和密码的正确性');
        }
        loginResult[0]["token"] = authorization.createToken();
        res.sendResult(loginResult[0], 200, '登录成功')
      }
    )
  }
);

router.get('/test',
  (req, res, next) => {

  }
)

module.exports = router;