var path = require('path');
var usersDao = require(path.join(process.cwd(), 'dao/usersDao'));
const md5 = require('md5');

/**
 * 
 * @param {*} loginStr 登录的账户或用户名
 * @param {*} pwd 密码（md5）
 */
module.exports.login = (loginStr, pwd, cb) => {
  // 先验证登录账户
  usersDao.login(loginStr, md5(pwd), (err, result) => {
    // cb(err, result);
    if (err) {
      return cb(err);
    } else if (result) {
      // 查询结果不为0时，代表登陆输入的账户有效，为0时说明数据库中无此账户
      if (result.length !== 0) {
        const admin = result[0]; // 当前登录账户
        // 根据允许登入的账户的企业代码查询该账户关联企业的企业信息
        usersDao.queryEnterpriseInfoOfCode(admin.code, (err, queryResult) => {
          if (err) {
            return cb(err);
          } else if (queryResult) {
            const enterpriseInfo = queryResult[0];
            const data = {
              ...admin,
              ...enterpriseInfo
            }
            return cb(null, data);
          }
        })
      } else if (result.length === 0) {
        // 查询无数据
        return cb(null, null);
      }
    }
  });
}