const express = require("express");
const router = express.Router();
const log4js = require('../utils/logger');

// 获取业务逻辑模块
var enterpriseServ = require('../services/enterpriseService');

router.use((req, res, next) => {
  next();
});

router.get('/getEnterpriseList',
  (req, res, next) => {
    next();
  },
  // 业务逻辑
  (req, res, next) => {
    // const {  } = 
    enterpriseServ.queryEnterpriseList((err, result) => {
      if (err) {
        return res.sendResult(null, 500, err);
      }
      if (!result || !result.length || result.length == 0) {
        return res.sendResult(result, 200, '查询成功，但未有数据！');
      }
      return res.sendResult(result, 200, '查询成功！');
    })
    // console.log(123);
    // next();
  }
)

router.get('/queryAllEnterpriseCode', 
  (req, res) => {
    enterpriseServ.queryAllEnterpriseCode((err, result) => {
      if (err) {
        return res.sendResult(null, 500, `查询失败！ERR:${err}`);
      } else if (result) {
        return res.sendResult(result, 200, '查询成功！');
      }
    })
  }
)
module.exports = router;