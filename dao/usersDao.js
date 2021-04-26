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
  databaseModules.connect(conn, err => {
    console.log(err);
  });
  const sql = `select username, account, enterprise_code as code, enabled, enterprise_auth as auth from admin where account = '${loginStr}' and password = '${pwd}'`;
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
  databaseModules.connect(conn, err => {
    console.log(err);
  });
  const sql = `select enterprise_code AS code, enterprise_name AS en_name, enterprise_addr AS addr, legal_person, enterprise_tele AS tel, region_id as region from enterprise_information where enterprise_code = '${code}'`;
  conn.query(sql, (err, result) => {
    if (err) {
      cb(err);
    } else cb(null, result);
  })
  conn.end();
}

/**
 * 根据企业代码和账户权限查询该账户所能配置的其他用户的账户信息
 * @param {String} code 企业代码
 * @param {String} auth 账户权限
 * @param {Function} cb 回调函数
 */
module.exports.queryOtherUsersInfo = (code, auth, cb) => {
  const conn = databaseModules.getConnection();
  databaseModules.connect(conn, err => {
    console.log(err);
  });
  if (code === '000') {
    // 系统总管理员
    var sql = `select * from (select user_serials, username, account, a.enterprise_code as code, a.enterprise_auth as auth, enabled, enterprise_name as en_name, enterprise_addr as addr, legal_person, enterprise_tele as tel from admin as a INNER JOIN enterprise_information as b ON a.enterprise_code = b.enterprise_code) as b where code = '000' and auth != 0 or code != '000'`;
  } else {
    var sql = `select * from (select user_serials, username, account, a.enterprise_code as code, a.enterprise_auth as auth, enabled, enterprise_name as en_name, enterprise_addr as addr, legal_person, enterprise_tele as tel from admin as a INNER JOIN enterprise_information as b ON a.enterprise_code = b.enterprise_code) as b where code = '${code}' and auth != '${auth}'`;
  }
  conn.query(sql, (err, result) => {
    if (err) {
      cb(err);
    } else {
      const res = JSON.parse(JSON.stringify(result));
      cb(null, res);
    }
  });
  conn.end();
}

/**
 * 修改某个企业的用户信息
 * @param {String} sql 修改系统用户信息的sql语句
 * @param {Function} cb 回调函数
 */
module.exports.updateUserInfo = (sql, cb) => {
  const conn = databaseModules.getConnection();
  databaseModules.connect(conn, err => {
    console.log(err);
  })
  conn.query(sql, (err, result) => {
    if (err) {
      cb(err);
    } else cb(null, result);
  });
  conn.end();
}

/**
 * 查询用户信息
 * @param {*} sql 
 * @param {*} cb 
 */
module.exports.queryUserInfo = (sql, cb) => {
  const conn = databaseModules.getConnection();
  databaseModules.connect(conn);
  conn.query(sql, (err, result) => {
    if (err) {
      cb(err);
    } else {
      const res = JSON.parse(JSON.stringify(result));
      cb(null, res);
    }
  });
  conn.end();
}

/**
 * 插入用户
 * @param {String} sql 插入sql语句
 * @param {Function} cb 回调函数
 */
module.exports.createUser = (sql, cb) => {
  const conn = databaseModules.getConnection();
  databaseModules.connect(conn);
  conn.query(sql, (err, result) => {
    if (err) {
      return cb(err);
    } else {
      const { affectedRows } = result;
      if (affectedRows > 0) {
        // 成功
        cb(null, 'create success');
      } else cb(null, 'create fail');
    }
  });
  conn.end();
}

/**
 * 删除用户
 * @param {String} sql 删除用户
 * @param {Function} cb 回调函数
 */
module.exports.deleteUser = (sql, cb) => {
  const conn = databaseModules.getConnection();
  databaseModules.connect(conn);
  conn.query(sql, (err, res) => {
    if (err) {
      cb(err);
    } else if (res) {
      const { affectedRows } = res;
      if (affectedRows > 0) {
        // 删除成功
        cb(null, 'delete success');
      } else cb(null, 'delete fail');
    }
  });
  conn.end();
}

/**
 * 查询所有的账户区域
 * @param {String} sql 查询语句
 * @param {Function} cb 回调函数
 */
module.exports.getAllAccountRegion = (sql, cb) => {
  const conn = databaseModules.getConnection();
  databaseModules.connect(conn);
  conn.query(sql, (err, res) => {
    if (err) {
      cb(err);
    } else {
      let result = JSON.parse(JSON.stringify(res));
      cb(null, result);
    }
  });
  conn.end();
}
