var path = require('path');
var usersDao = require(path.join(process.cwd(), 'dao/usersDao'));

/**
 * 
 * @param {*} loginStr 登录的账户或用户名
 * @param {*} pwd 密码（md5）
 */
module.exports.login = (loginStr, pwd, cb) => {
  if (!loginStr) {
    return cb('用户名或账户号不能为空');
  }
  if (!pwd) {
    return cb('密码不能为空');
  }
  usersDao.login(loginStr, pwd, (err, result) => {
    cb(err, result);
  })
}