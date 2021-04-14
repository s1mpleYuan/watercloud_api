var databaseModules = require('../modules/database');

/**
 * 查询所有注册企业的数据
 * @param {*} cb 回调函数
 */
module.exports.queryEnterpriseList = (cb) => {
  const conn = databaseModules.getConnection();
  databaseModules.connect(conn, err=>{
    console.log(err);
  });
  const sql = "select * from enterprise_information where enterprise_code != '000'";
  conn.query(sql, (err, result) => {
    if (err) {
      cb(err);
    }
    cb(null, result);
  })
  conn.end();
}

/**
 * 获取所有的企业代码
 * @param {Function} cb 回调函数
 */
module.exports.queryAllEnterpriseCode = (cb) => {
  const conn = databaseModules.getConnection();
  databaseModules.connect(conn);
  const sql = 'select enterprise_code as code, enterprise_name as name from enterprise_information';
  conn.query(sql, (err, res) => {
    if (err) {
      cb(err);
    } else cb(null, res);
  });
  conn.end();
}