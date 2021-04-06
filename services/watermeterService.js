const watermeterDao = require('../dao/watermeterDao');

/**
 * 
 * @param {String} condition 搜索过滤值，可为空，不为null
 * @param {Array} fields 需要查询的字段的数组，数组长度可为0即查询全部，但不为null
 * @param {Function} cb 回调函数
 */
module.exports.queryWaterMeterCopyRecordOfCondition = (condition, fields, cb) => {
  if (fields && fields.length == 0) {
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
  for (const j in fields) {
    if (j == 0) {
      sql += 'where ';
    }
    sql += `${fields[j]} = ${condition}' `;
    if (j != fields.length - 1) {
      sql += 'or ';
    }
  }
  console.log(sql);
  watermeterDao.queryWaterMeterCopyRecords(sql, (err, res) => {
    if (err) {
      return cb(err);
    } else {
      for (const i in res) {
        res[i].Serials = Number(i) + 1;
      }
      return cb(null, res);
    }
  })

};