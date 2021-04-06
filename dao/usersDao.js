var path = require('path');
var databaseModules = require('../modules/database');

/**
 * 登录
 * @param {*} loginStr 登录的账户或用户名
 * @param {*} pwd 密码（md5）
 * @param {*} cb 回调函数
 */
module.exports.login = (loginStr, pwd, cb) => {
  const conn = databaseModules.getConnection();
  databaseModules.connect(conn);
  const sql = `select username, account, enterprise_code as code from admin where username = ${loginStr} and password = ${pwd} or account = ${loginStr} and password = ${pwd}`;
  conn.query(sql, (err, result) => {
    if (err) {
      cb(err);
    }
    else cb(null, result);
  })
  conn.end();
}

module.exports.queryUsersList = () => {

}