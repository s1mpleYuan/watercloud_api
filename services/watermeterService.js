const watermeterDao = require('../dao/watermeterDao');
const dayjs = require('dayjs');
/**
 * 
 * @param {String} condition 搜索过滤值，可为空，不为null
 * @param {Array} fields 需要查询的字段的数组，数组长度可为0即查询全部，但不为null
 * @param {Function} cb 回调函数
 */
module.exports.queryWaterMeterCopyRecordOfCondition = (condition, fields, cb) => {
  if (fields && fields.length == 14) {
    // 查询全部时
    var sql = 'select * ';
  } else {
    // 查询部分时
    var sql = 'select ';
    for (const i in fields) {
      sql = sql + `${fields[i]}`;
      if (i != fields.length - 1) {
        sql += ', '
      }
    }
  }
  sql += ' from copy_record ';
  if (condition) {
    for (const j in fields) {
      if (j == 0) {
        sql += 'where ';
      }
      sql += `${fields[j]} like '%${condition}%' `;
      if (j != fields.length - 1) {
        sql += 'or ';
      }
    }
  }
  // console.log(sql);
  watermeterDao.queryWaterMeterCopyRecords(sql, (err, res) => {
    if (err) {
      return cb(err);
    } else {
      for (const i in res) {
        const { Copy_time, Equipment_time } = res[i];
        if (Copy_time) {
          res[i].Copy_time = dayjs(Copy_time).format('YYYY-MM-DD HH:mm:ss');
        }
        if (Equipment_time) {
          res[i].Equipment_time = dayjs(Equipment_time).format('YYYY-MM-DD HH:mm:ss');
        }
      }
      return cb(null, res);
    }
  })

};