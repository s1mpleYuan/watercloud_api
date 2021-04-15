var express = require("express");
var router = express.Router();
const authorization = require('../modules/authorization');
const log4js = require('../utils/logger');

// 获取业务模块
var usersServ = require('../services/usersService');

//////////////////////////////////////////////////////////////////////////////////////////////////////// 登录
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
          if (enabled == '1') {
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

/////////////////////////////////////////////////////////////////////////////////////////////// 查询其他用户信息
router.post('/queryOtherUsersInfo',
  // 验证参数
  (req, res, next) => {
    const { code, auth } = req.body;
    if (!code || code == "") {
      const log = log4js.setLog("/users/queryOtherUsersInfo", "error", '请传入code参数');
      log4js.loggerOutput("ERROR", log)
      return res.sendResult(null, 400, '请传入code参数');
    } else if (!auth || auth == "") {
      const log = log4js.setLog("/users/queryOtherUsersInfo", "error", '请传入auth参数');
      log4js.loggerOutput("ERROR", log)
      return res.sendResult(null, 400, '请传入auth参数');
    } else if (auth == '1') {
      const log = log4js.setLog("/users/queryOtherUsersInfo", "error", '非管理员账户没有配置其他用户的权限！');
      log4js.loggerOutput("ERROR", log)
      return res.sendResult(null, 403, '非管理员账户没有配置其他用户的权限！');
    } else next();
  },
  // 业务逻辑
  (req, res, next) => {
    const { code, auth } = req.body;
    usersServ.queryOtherUsersInfo(code, auth, (err, queryResult) => {
      if (err) {
        return res.sendResult(null, 403, err);
      } else if (queryResult) {
        if (queryResult.length === 0) {
          return res.sendResult(queryResult, 200, '查询成功，该管理员账户下没有其他用户账户，请添加！');
        } else {
          for (const i in queryResult) {
            queryResult[i].user_serials = Number(i) + 1;
          }
          return res.sendResult(queryResult, 200, '查询成功!');
        }
      } else {
        next();
      }
    })
  }
)

/////////////////////////////////////////////////////////////////////////////////////////////////////////// 编辑用户信息
router.post('/editUserInfo',
  (req, res, next) => {
    const { userInfo } = req.body;
    if (!userInfo) {
      const log = log4js.setLog("/users/editUserInfo", "error", '参数不能为空！');
      log4js.loggerOutput("ERROR", log)
      return res.sendResult(null, 400, '参数不能为空！');
    }
    userInfo.enabled = Number(userInfo.enabled);
    next();
  },
  (req, res, next) => {
    const { username, account, auth, code } = req.body.userInfo;
    usersServ.checkUserLegitimacy('edit', account, auth, code, (err, result) => {
      if (err) {
        cb(err);
      } else if (result) {
        if (result === 'too many account') {
          return res.sendResult(null, 400, '账户数量最大只能10个！');
        } else if (result.msg === 'only one admin') {
          return res.sendResult(null, 400, `该企业最多只能有一个管理员账户 企业代码:${code} 管理员账户:${result.account}`);
        }
      } else {
        // 允许修改
        usersServ.updateUserInfo(req.body.userInfo, (err, result) => {
          if (err) {
            return res.sendResult(null, 500, err);
          } else if (result) {
            if (result === 'success') {
              return res.sendResult(null, 202, '修改成功！');
            } else {
              return res.sendResult(null, 400, '修改失败！');
            }
          }
        })
        // return res.sendResult(null, 200, '...');
      }
    });
  }
)

//////////////////////////////////////////////////////////////////////////////////////////// 新建用户
router.put('/createUserInfo',
  (req, res, next) => {
    const { userInfo } = req.body;
    if (!userInfo) {
      const log = log4js.setLog("/users/editUserInfo", "error", '参数不能为空！');
      log4js.loggerOutput("ERROR", log)
      return res.sendResult(null, 400, '参数不能为空！');
    }
    userInfo.enabled = Number(userInfo.enabled);
    next();
  },
  (req, res, next) => {
    const { userInfo } = req.body;
    userInfo.auth = Number(userInfo.auth);
    const { account, auth, code } = req.body.userInfo;
    usersServ.checkUserLegitimacy('create', account, auth, code, (err, result) => {
      if (err) {
        return res.sendResult(err);
      } else if (result) {
        if (result === 'too many account') {
          return res.sendResult(null, 400, '账户数量最大只能10个！');
        } else if (result.msg === 'only one admin') {
          return res.sendResult(null, 400, `该企业最多只能有一个管理员账户 企业代码:${code} 管理员账户:${result.account}`);
        } else if (result === 'account exist') {
          return res.sendResult(null, 400, `账户${account}已存在`);
        }
      } else {
        // 允许新建
        usersServ.createUserInfo(req.body.userInfo, (err, result) => {
          if (err) {
            return res.sendResult(null, 500, err);
          } else if (result) {
            if (result === 'create success') {
              return res.sendResult(null, 201, '新建成功！');
            } else {
              return res.sendResult(null, 400, '新建失败！');
            }
          }
        })
        // return res.sendResult(null, 200, '555');
      }
    });
  }
)

/////////////////////////////////////////////////////////////////////////////////// 删除用户
router.delete('/deleteUserInfo',
  (req, res, next) => {
    const { account } = req.query;
    if (!account || account == '') {
      return res.sendResult(null, 500, '请传入account参数!');
    } else next();
  },
  (req, res, next) => {
    const { account } = req.query;
    usersServ.deleteUserInfo(account, (err, result) => {
      if (err) {
        return res.sendResult(null, 500, err);
      } else if (result) {
        if (result === 'delete success') {
          return res.sendResult(null, 203, '删除成功！');
        } else {
          return res.sendResult(null, 400, '删除失败！该账户不存在，请刷新！');
        }
      }
    })
  }
)

//////////////////////////////////////////////////////////////////////////////////////////// 根据条件查询其他用户信息
router.post('/queryUserInfoByConditions',
  (req, res, next) => {
    // const { params } = 
    let { auth, code, conditions } = req.body;
    if (!auth) {
      return res.sendResult(null, 400, '请传入auth参数');
    } else if (!code) {
      return res.sendResult(null, 400, '请传入code参数');
    } else if (!conditions) {
      return res.sendResult(null, 400, '请传入conditions参数');
    } else {
      auth = typeof auth == 'number' ? req.body : Number(req.body.auth);
      let arr = [];
      conditions.forEach(item => {
        if (item.value !== '') {
          if (item.key == 'auth' || item.key == 'enabled') {
            item.value = Number(item.value);
            arr.push(item);
          } else arr.push(item);
        }
      });
      req.body.conditions = arr;
      next();
    }
  },
  (req, res, next) => {
    let { auth, code, conditions } = req.body;
    usersServ.queryUserInfoListByConditions(code, auth, conditions, (err, result) => {
      if (err) {
        return res.sendResult(null, 500, err);
      } else if (result) {
        return res.sendResult(result, 200, '查询成功！');
      }
    })
  }
)


module.exports = router;