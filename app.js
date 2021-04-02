var express = require('express');
var app = express();
const port = 8888;

// 设置统一的响应格式
var resextra = require('./modules/resextra');
app.use(resextra);

// 初始化数据库
var database = require('./modules/database');
var connenction = database.getDatabase();

//设置跨域访问
app.all('*', function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	res.header("X-Powered-By", ' 3.2.1')
	res.header("Content-Type", "application/json;charset=utf-8");
	next();
});

app.get('/test', (req, res, next) => {
	res.sendResult(null, 200, 'waterclound接口测试成功');
})

app.get('/login', (req, res, next) => {
	const { account, pwd } = req.query;
	const sql = `select username, account, enterprise_code as code from admin where account = '${account}' and password = '${pwd}'`;
	connenction.query(sql, (err, result) => {
		if (err) {
			// console.error('[WATERCLOUND]');
			res.sendResult(err, 500, '登录失败');
		} else {
			console.log(result);
			if (!result||result.length === 0) {
				res.sendResult(null, 404, '登录失败！请检查账户或密码是否正确');
				// console.log('登录失败！请检查账户或密码是否正确');
			} else {
				res.sendResult(result[0], 200, '登录成功');
			}
		}
	})
});


app.listen(port, () => console.log(`watercloud app listening on http://localhost:${port} !`))
