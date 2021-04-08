var path = require('path');
var databaseModules = require('../modules/database');

/**
 * 登录
 * @param {String} loginStr 登录的账户或用户名
 * @param {String} pwd 密码（md5）
 * @param {Function} cb 回调函数
 */
module.exports.login = (loginStr, pwd, cb) => {
  const conn = databaseModules.getConnection();
  databaseModules.connect(conn, err=>{
    console.log(err);
  });
  const sql = `select username, account, enterprise_code as code, enabled, enterprise_auth as auth from admin where username = '${loginStr}' and password = '${pwd}' or account = '${loginStr}' and password = '${pwd}'`;
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
  databaseModules.connect(conn, err=>{
    console.log(err);
  });
  const sql = `select enterprise_code AS code, enterprise_name AS en_name, enterprise_addr AS addr, legal_person, enterprise_tele AS tel from enterprise_information where enterprise_code = '${code}'`;
  conn.query(sql, (err, result) => {
    if (err) {
      cb(err);
    } else cb(null, result);
  })
  conn.end();
}

/**
 * 根据企代码和账户权限查询该账户所能配置的其他用户的账户信息
 * @param {String} code 企业代码
 * @param {String} auth 账户权限
 * @param {Function} cb 回调函数
 */
module.exports.queryOtherUsersInfo=(code, auth, cb)=>{
  const conn = databaseModules.getConnection();
  databaseModules.connect(conn, err=>{
    console.log(err);
  });
  const sql = `select user_serials, username, account, enterprise_code as code, enterprise_auth as auth, enabled from admin where enterprise_code = '${code}' and enterprise_auth != '${auth}'`;
  conn.query(sql, (err, result) => {
    if (err) {
      cb(err);
    } else cb(null, result);
  });
  conn.end();
}

