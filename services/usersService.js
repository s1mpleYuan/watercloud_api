var path = require('path');
var usersDao = require(path.join(process.cwd(), 'dao/usersDao'));
const md5 = require('md5');
const { connect } = require('../modules/database');
const _ = require('loadsh');

/**
 * 登录
 * @param {String} loginStr 登录的账户号或用户名
 * @param {String} pwd 密码
 * @param {Function} cb 回调函数
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
 * 根据企业代码和账户权限查询该账户所能配置的其他用户的账户信息
 * @param {String} code 企业代码
 * @param {String} auth 账户权限
 * @param {Function} cb 回调函数
 */
module.exports.queryOtherUsersInfo = (code, auth, cb) => {
  // 先查询企业信息
  usersDao.queryOtherUsersInfo(code, auth, (err, result) => {
    if (err) {
      return cb(err);
    } else if (result) {
      return cb(null, result);
    }
  })
}

/**
 * 修改账户信息
 * @param {Object} userInfo 要修改的新账户信息
 * @param {Function} cb 回调函数
 */
module.exports.updateUserInfo = (userInfo, cb) => {
  const { username, account, code, auth, enabled, en_name, addr, legal_person, tel } = userInfo;
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
/**
 * 新建账户信息
 * @param {Object} userInfo 新建的用户信息
 * @param {Function} cb 回调函数
 */
module.exports.createUserInfo = (userInfo, cb) => {
  const { username, account, pwd, code, auth } = userInfo;
  const create_sql = `insert into admin(username, account, password, enterprise_code, enterprise_auth) values('${username}', '${account}', '${md5(pwd)}', '${code}', '${auth}')`;
  usersDao.createUser(create_sql, (err, res) => {
    if (err) {
      cb(err);
    } else if (res) {
      cb(null, res);
    }
  });
}

/**
 * 检查账户的合法性，用于编辑或新建前的检测
 * @param {String} type 检查的目的 edit 用于编辑 create 用于新建
 * @param {String} account 检查的账号
 * @param {Number} auth 权限 0 管理员 1 普通用户
 * @param {String} code 企业代码
 * @param {Function} cb 回调函数
 */
module.exports.checkUserLegitimacy = (type, account, auth = -1, code = -1, cb) => {
  if (type === 'edit') {
    // 先通过企业代码查询该企业下的账户数量及管理员个数
    const sql = `select account, enterprise_auth as auth from admin where enterprise_code = '${code}'`;
    usersDao.queryUserInfo(sql, (err, res) => {
      if (err) {
        return cb(err);
      } else if (res) {
        const accountArr = res;
        let cnt = 0;
        if (auth !== 0) {
          if (accountArr.length === 10) {
            return cb(null, 'too many account');
          } else cb(null, null);
        } else if (auth == 0) {
          // 要修改的新账户为管理员账户
          let authArr = accountArr.filter(item => {
            if (item.auth === 0) {
              cnt++;
              return item;
            }
          });
          if (authArr.length > 0) {
            return cb(null, {
              msg: 'only one admin',
              account: authArr[0].account
            });
          } else return cb(null, null);
        }
      }
    });
  } else if (type === 'create') {
    // 先检查账户账号是否存在
    const sql_accout = `select count(*) as num from admin where account = '${account}'`;
    usersDao.queryUserInfo(sql_accout, (err, res) => {
      if (err) {
        return cb(err);
      } else if (res) {
        const { num } = res[0];
        if (num > 0) {
          // 账号存在
          return cb(null, 'account exist');
        } else {
          // 不存在 允许新建
          const sql = `select account, enterprise_auth as auth from admin where enterprise_code = '${code}'`;
          usersDao.queryUserInfo(sql, (err, res) => {
            if (err) {
              cb(err);
            } else if (res) {
              const accountArr = res;
              if (auth !== 0) {
                if (accountArr.length === 10) {
                  return cb(null, 'too many account');
                } else cb(null, null);
              } else if (auth == '0' || auth == 0) {
                // 要修改的新账户为管理员账户
                let authArr = accountArr.filter(item => {
                  if (item.auth === 0) {
                    return item;
                  }
                });
                if (authArr.length > 0) {
                  return cb(null, {
                    msg: 'only one admin',
                    account: authArr[0].account
                  });
                } else return cb(null, null);
              }
            }
          });
        }
      }
    });
  }
}

/**
 * 删除用户
 * @param {String} account 要删除的账户账户
 */
module.exports.deleteUserInfo = (account, cb) => {
  const sql = `delete from admin where account = '${account}'`;
  usersDao.deleteUser(sql, (err, res) => {
    if (err) {
      cb(err);
    } else if (res) {
      cb(null, res)
    }
  });
}

/**
 * 根据条件筛选查询账户信息
 * @param {String} code 当前查询账户的企业代码
 * @param {Number} auth 当前账户的权限
 * @param {Array} condition 筛选的值的字段
 * @param {String} value 筛选值
 * @param {Function} cb 回调函数
 */
module.exports.queryUserInfoListByConditions = (code, auth, conditions, cb) => {
  usersDao.queryOtherUsersInfo(code, auth, (err, res) => {
    if (err) {
      cb(err);
    } else if (res) {
      let final = res.filter(item => {
        let cnt = 0;
        for (const i in conditions) {
          if (item[conditions[i].key] === conditions[i].value) {
            cnt++;
          }
        }
        if (cnt == conditions.length) {
          return item;
        }
      })
      for (const k in final) {
        final[k].user_serials = Number(k) + 1;
      }
      cb(null, final);
    }
  })
}