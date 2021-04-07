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
  const sql = `select username, account, enterprise_code as code from admin where username = '${loginStr}' and password = '${pwd}' or account = '${loginStr}' and password = '${pwd}'`;
  conn.query(sql, (err, result) => {
    if (err) {
      cb(err);
    }
    else cb(null, result);
  })
  conn.end();
}

/**
 * 根据企业代码查询企业信息
 * @param {String} code 企业代码
 * @param {Function} cb 回调函数
 */
module.exports.queryEnterpriseInfoOfCode = (code, cb) => {
  const conn = databaseModules.getConnection();
  databaseModules.connect(conn);
  const sql = `select enterprise_code AS code, enterprise_name AS en_name, enterprise_addr AS addr, legal_person, enterprise_tele AS tele from enterprise_information where enterprise_code = '${code}'`;
  conn.query(sql, (err, result) => {
    if (err) {
      cb(err);
    } else cb(null, result);
  })
  conn.end();
}