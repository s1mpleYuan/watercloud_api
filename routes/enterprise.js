var express = require("express");
var router = express.Router();
var authorization = require("../modules/authorization");

// 获取业务逻辑模块

router.use((req, res, next) => {
  next();
});

router.post('/getEnterpriseList',
  (req, res, next) => {
    next();
  },
  // 业务逻辑
  // (req, res, next) => {
  //   // const {  } = 
  // }
)