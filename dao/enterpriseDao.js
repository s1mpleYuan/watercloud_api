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
  const sql = "select * from enterprise_information where enterprise_code != '0000'";
  conn.query(sql, (err, result) => {
    if (err) {
      cb(err);
    }
    cb(null, result);
  })
  conn.end();
}