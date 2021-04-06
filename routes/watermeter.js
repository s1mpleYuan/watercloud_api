const express = require("express");
const router = express.Router();
const log4js = require('../utils/logger');

// 获取业务逻辑模块
const watermeterServ = require('../services/watermeterService');

/**
  根据条件查询水表抄收记录
 */
router.post('/queryWaterMeterCopyRecords',
  (req, res, next) => {
    const { condition, fields } = req.body;
    if (condition == null) {
      return res.sendResult(null, 400, '请传入condition参数');
    }
    if (!fields) {
      req.body.fields = [];
      // return res.sendResult(null, 400, '请传入fields参数');
    }
    next();
  },
  (req, res, next) => {
    const { condition, fields } = req.body;
    // console.log(req.body);
    watermeterServ.queryWaterMeterCopyRecordOfCondition(condition, fields, (err, queryResult) => {
      if (err) {
        const log = log4js.setLog("/watermeter/queryWaterMeterCopyRecords", "error", err);
        log4js.loggerOutput("ERROR", log);
        return res.sendResult(null, 500, err);
      }
      if (!queryResult || !queryResult.length || queryResult.length == 0) {
        const log = log4js.setLog("/watermeter/queryWaterMeterCopyRecords", "success", '查询成功,但数据库中没有数据！');
        log4js.loggerOutput("INFO", log);
        return res.sendResult([], 200, '查询成功,但数据库中没有数据！');
      };
      const log = log4js.setLog("/watermeter/queryWaterMeterCopyRecords", "success", '查询成功！');
      log4js.loggerOutput("INFO", log);
      return res.sendResult(queryResult, 200, '查询成功！');
    })
  }
);

module.exports = router;
