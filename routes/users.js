var express = require("express");
var router = express.Router();
const authorization = require('../modules/authorization');
const log4js = require('../utils/logger');

// 获取业务模块
var usersServ = require('../services/usersService');


router.post('/login',
  // 参数校验
  (req, res, next) => {
    // console.log(req.body, "res.body");
    next();
  },
  // 业务逻辑
  (req, res, next) => {
    const { loginStr, pwd } = req.body;
    usersServ.login(
      loginStr,
      pwd,
      (err, loginResult) => {
        if (err) {
          const log = log4js.setLog("LOGIN", "ERROR", err);
          log4js.loggerOutput("DEBUG", log)
          return res.sendResult(null, 500, err);
        }
        if (!loginResult || !loginResult.length || loginResult.length == 0) {
          const log = log4js.setLog("LOGIN", "FAILURE", "登录失败，请检查登录账户和密码的正确性");
          log4js.loggerOutput("INFO", log)
          return res.sendResult(null, 404, '登录失败，请检查登录账户和密码的正确性');
        }
        loginResult[0]["token"] = authorization.createToken();
        const log = log4js.setLog("LOGIN", "SUCCESS", `${loginResult[0].username} 登录成功`);
        log4js.loggerOutput("INFO", log)
        res.sendResult(loginResult[0], 200, '登录成功')
      }
    )
  }
);


module.exports = router;