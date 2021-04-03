var express = require('express');
var bodyParser = require('body-parser');
var app = express();
const port = 8888;

// 公共系统初始化
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


// 设置统一的响应格式
var resextra = require('./modules/resextra');
app.use(resextra);

// 初始化数据库
// var database = require('./modules/database');
// var connenction = database.getDatabase();

//设置跨域访问
app.all('*', function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	res.header('Access-Control-Allow-Headers', 'X-Requested-With, mytoken')
	res.header('Access-Control-Allow-Headers', 'X-Requested-With, Authorization')
	res.header("X-Powered-By", ' 3.2.1')
	res.header("Content-Type", "application/json;charset=utf-8");
	next();
});

// 用户相关业务模块
app.use('/users', require('./routes/users'));


app.get('/test', (req, res, next) => {
	res.sendResult(null, 200, 'waterclound接口测试成功');
})
app.listen(port, () => console.log(`watercloud app listening on http://localhost:${port} !`))
