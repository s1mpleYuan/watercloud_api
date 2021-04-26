const express = require("express");
const router = express.Router();
const log4js = require('../utils/logger');

// 获取业务逻辑模块
const watermeterServ = require('../services/watermeterService');

////////////////////////////////////////////////////////// 根据条件查询水表抄收记录
router.post('/queryWaterMeterCopyRecords',
  (req, res, next) => {
    const { condition, fields } = req.body;
    if (condition == null) {
      return res.sendResult(null, 400, '请传入condition参数');
    }
    if (!fields || fields.length == 0) {
      // req.body.fields = [];
      return res.sendResult(null, 400, '请至少选择一个筛选框条件！');
    }
    next();
  },
  (req, res, next) => {
    const { condition, fields } = req.body;
    watermeterServ.queryWaterMeterCopyRecordOfCondition(condition, fields, (err, queryResult) => {
      if (err) {
        return res.sendResult(null, 500, err);
      }
      if (!queryResult || !queryResult.length || queryResult.length == 0) {
        return res.sendResult([], 200, '查询成功,但数据库中没有数据！');
      };
      return res.sendResult(queryResult, 200, '查询成功！');
    })
  }
);

module.exports = router;
