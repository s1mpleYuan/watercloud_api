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
          const log = log4js.setLog("/users/login", "error", err);
          log4js.loggerOutput("ERROR", log)
          return res.sendResult(null, 500, err);
        }
        if (!loginResult) {
          const log = log4js.setLog("/users/login", "failure", "登录失败，请检查登录账户和密码的正确性");
          log4js.loggerOutput("DEBUG", log)
          return res.sendResult(null, 404, '登录失败，请检查登录账户和密码的正确性');
        } else {
          const { enabled } = loginResult;
          if (enabled == '0') {
            const log = log4js.setLog("/users/login", "failure", "登录失败，该账户已被封禁，请联系管理员");
            log4js.loggerOutput("DEBUG", log)
            return res.sendResult(null, 404, '登录失败，该账户已被封禁，请联系管理员！');
          } else {
            loginResult["token"] = authorization.createToken();
            const log = log4js.setLog("/users/login", "success", `${loginResult.username} 登录成功`);
            log4js.loggerOutput("INFO", log);
            res.sendResult(loginResult, 200, '登录成功');
          }
        }
      }
    )
  }
);

router.post('/queryOtherUsersInfo',
  // 验证参数
  (req, res, next) => {
    const { code, auth } = req.body;
    if (!code) {
      const log = log4js.setLog("/users/queryOtherUsersInfo", "error", err);
      log4js.loggerOutput("ERROR", log)
      return res.sendResult(null, 400, '请传入code参数');
    } else if (!auth) {
      const log = log4js.setLog("/users/queryOtherUsersInfo", "error", err);
      log4js.loggerOutput("ERROR", log)
      return res.sendResult(null, 400, '请传入auth参数');
    } else if (auth == '1') {
      const log = log4js.setLog("/users/queryOtherUsersInfo", "error", err);
      log4js.loggerOutput("ERROR", log)
      return res.sendResult(null, 403, '非管理员账户没有配置其他用户的权限！');
    } else next();
  },
  // 业务逻辑
  (req, res, next) => {
    const { code, auth } = req.body;
    usersServ.queryOtherUsersInfo(code, auth, (err, queryResult) => {
      if (err) {
        const log = log4js.setLog("/users/queryOtherUsersInfo", "error", err);
        log4js.loggerOutput("ERROR", log)
        return res.sendResult(null, 403, err);
      } else if (queryResult) {
        if (queryResult.length === 0) {
          const log = log4js.setLog("/users/queryOtherUsersInfo", "success", '查询成功，该管理员账户下没有其他用户账户，请添加！');
          log4js.loggerOutput("DEBUG", log)
          return res.sendResult(queryResult, 200, '查询成功，该管理员账户下没有其他用户账户，请添加！');
        } else {
          for (const i in queryResult) {
            queryResult[i].user_serials = Number(i) + 1;
          }
          const log = log4js.setLog("/users/queryOtherUsersInfo", "success", '查询成功！');
          log4js.loggerOutput("INFO", log)
          return res.sendResult(queryResult, 200, '查询成功!');
        }
      } else {
        next();
      }
    })
  }
)

module.exports = router;