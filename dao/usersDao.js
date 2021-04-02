var path = require('path');
var databaseModules = require('../modules/database');

/**
 * 
 * @param {*} loginStr 登录的账户或用户名
 * @param {*} pwd 密码（md5）
 * @param {*} cb 回调函数
 */
module.exports.login = (loginStr, pwd, cb) => {
  db = databaseModules.getDatabase();
  const sql = `select username, account, enterprise_code as code from admin where username = ${loginStr} and password = ${pwd} or account = ${loginStr} and password = ${pwd}`;
  db.query(sql, (err, result) => {
    if (err) {
      return cb(err);
    }
    cb(null, result);
  })
}