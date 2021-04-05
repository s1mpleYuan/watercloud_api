var path = require('path');
const { createBrotliCompress } = require('zlib');
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