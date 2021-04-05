var path = require('path');
var usersDao = require(path.join(process.cwd(), 'dao/usersDao'));

/**
 * 
 * @param {*} loginStr 登录的账户或用户名
 * @param {*} pwd 密码（md5）
 */
module.exports.login = (loginStr, pwd, cb) => {
  usersDao.login(loginStr, pwd, (err, result) => {
    cb(err, result);
  })
}