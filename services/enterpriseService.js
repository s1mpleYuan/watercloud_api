var path = require('path');
var enterpriseDao = require(path.join(process.cwd(), 'dao/enterpriseDao'));

/**
 * 查询所有注册企业的数据
 * @param {·} cb 回调函数
 */
module.exports.queryEnterpriseList = (cb) => {
  enterpriseDao.queryEnterpriseList((err, res) => {
    cb(err, res);
  })
}


/**
 * 查询所有的企业代码
 * @param {Function} cb 回调函数
 */
module.exports.queryAllEnterpriseCode = (cb) => {
  enterpriseDao.queryAllEnterpriseCode((err, res) => {
    return cb(err, res);
  });
}