var path = require('path');
var usersDao = require(path.join(process.cwd(), 'dao/usersDao'));
const md5 = require('md5');
const { connect } = require('../modules/database');
const _ = require('loadsh');

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

/**
 * 根据企代码和账户权限查询该账户所能配置的其他用户的账户信息
 * @param {String} code 企业代码
 * @param {String} auth 账户权限
 * @param {Function} cb 回调函数
 */
module.exports.queryOtherUsersInfo = (code, auth, cb) => {
  // 先查询企业信息
  usersDao.queryEnterpriseInfoOfCode(code, (err, result) => {
    if (err) {
      return cb(err);
    } else if (result) {
      if (result.length > 0) {
        const enterprise = JSON.parse(JSON.stringify(result))[0];
        // 再查询其他用户信息
        usersDao.queryOtherUsersInfo(code, auth, (err, result) => {
          if (err) {
            return cb(err);
          } else if (result) {
            const usersArray = JSON.parse(JSON.stringify(result));
            let data = [];
            for (const i in usersArray) {
              data.push({
                ...usersArray[i],
                ...enterprise
              });
            }
            return cb(null, data);
          }
        })
      } else return cb(null, result);
    }
  })
}


module.exports.updateUserInfo = (userInfo, cb) => {
  const { username, account, code, auth, enabled, en_name, addr, legal_person, tel } = userInfo;
  const sql_EnterpriseInfo = `update enterprise_information set enterprise_name = '${en_name}', enterprise_addr = '${addr}', legal_person = '${legal_person}', enterprise_tele = '${tel}' where enterprise_code = '${code}'`;
  usersDao.updateUserInfo(sql_EnterpriseInfo, (err, res) => {
    if (err) {
      return cb(err);
    } else if (res) {
      const { affectedRows } = res;
      if (affectedRows > 0) {
        const sql_adminUser = `update admin set username = '${username}', enterprise_auth = '${auth}', enabled = '${enabled}' where account = '${account}'`;
        usersDao.updateUserInfo(sql_adminUser, (err, res) => {
          if (err) {
            return cb(err);
          } else if (res) {
            const { affectedRows } = res;
            if (affectedRows > 0) {
              return cb(null, 'success');
            } else {
              return cb(null, 'fail');
            }
          }
        });
      }
    }
  });
}

module.exports.checkUserAccount = (checkFields, type = 'EDIT', cb) => {
  const { username, auth, code } = checkFields;
  if (type == 'CREATE') {
    // 如果是新建账户，则每个公司只允许存在除管理员外共10个账户
    const check_user_count_sql = `select count(*) as count from admin where enterprise_code = '${code}' and enterprise_auth != '0'`;
    usersDao.checkUserAccountReasonable(check_user_count_sql, (err, result) => {
      if (err) {
        return cb(err);
      } else if (result) {
        const { count } = result[0];
        if (count > 10) {
          // 超过10个账户
          return cb('新建失败，该公司已经存在10个账户！');
        } else {
          // 判断新建的账户的用户名是否存在
          // 检查用户名是否存在
          const check_username_sql = `select case when count(*) > 0 then 1 else 0 end as result from admin where username = '${username}'`;
          usersDao.checkUserAccountReasonable(check_username_sql, (err, queryResult) => {
            if (err) {
              return cb(err);
            } else if (queryResult) {
              if (queryResult[0].result == 1) {
                // 存在该账户
                return cb(`用户名${username}已存在！`);
              }
            }
          });
        }
      }
    });
  }
  // 修改及编辑
  // 如果要修改或新建的账户的新权限为管理员，则检查权限是否合理（一个公司只能存在一个管理员）
  if (auth == '0') {
    const check_auth_sql = `select enterprise_auth as auth from admin where enterprise_code = '${code}'`;
    usersDao.checkUserAccountReasonable(check_auth_sql, (err, result) => {
      if (err) {
        return cb(err);
      } else if (result) {
        const userAuthArray = JSON.parse(JSON.stringify(result));
        let authCnt = 0;
        for (const i in userAuthArray) {
          const { auth } = userAuthArray[i];
          if (auth == 0) {
            authCnt++;
          }
        }
        if (authCnt > 0) {
          // 该账号所属公司已经存在管理员账户
          return cb(`该公司已经存在一个管理员账户 [企业代码：${code}]`);
        }
      }
    });
  }
}