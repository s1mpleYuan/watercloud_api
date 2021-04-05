

/**
  token 测试
 */
// var authorization = require('../modules/authorization');

// var token = authorization.createToken('yqy');

// // console.log(token);

// authorization.tokenAuth(token, (err, decode) => {
//   if (err) {
//     console.log(err);
//     return;
//   }
//   // console.log(decode);
//   const { exp } = decode;
//   console.log(exp * 1000);
//   var date = new Date();
//   console.log(date.getTime());
// })

/**
  数据库测试
 */
// const databaseModules = require('../modules/database');

// const conn = databaseModules.getConnection();

// databaseModules.connect(conn);

// conn.query('Select * from admin', (err, result,fields) => {
//   if (err) {
//     console.log(err);
//     return;
//   }
//   console.log(result);
// });

/**
  log4js测试
 */
const log4js = require('../utils/logger');

const log = log4js.setLog('login', 'fail', '登录失败');
log4js.loggerOutput("INFO", log);

