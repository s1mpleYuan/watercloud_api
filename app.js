var express = require("express");
var bodyParser = require('body-parser');
var authorization = require('./modules/authorization');
var app = express();
const port = 8888;

// 公共系统初始化
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


// 设置统一的响应格式
var resextra = require('./modules/resextra');
app.use(resextra);

//设置跨域访问
app.all('*',
	(req, res, next) => {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
		// res.header('Access-Control-Allow-Headers', 'X-Requested-With, mytoken')
		res.header('Access-Control-Allow-Headers', 'X-Requested-With, Authorization')
		res.header("X-Powered-By", ' 3.2.1')
		res.header("Content-Type", "application/json;charset=utf-8");
		if (req.method == 'OPTIONS') res.sendStatus(200)
		/*让options请求快速返回*/ else next()
	},
	(req, res, next) => {
		const { originalUrl, headers } = req;
		if (originalUrl === '/users/login') {
			next();
		} else {
			// token校验
			var req_token = headers.authorization;
			if (!req_token) {
				return res.sendResult(null, 401, '请进行登录以获取token!');
			}
			if (req_token.includes("Bearer")) {
				req_token = req_token.split(' ')[1];
			}
			authorization.tokenAuth(req_token, (err, decode) => {
				// 
				if (err) {
					const { name, message } = err;
					if (name === 'TokenExpiredError' && message === 'jwt expired') {
						return res.sendResult(null, 401, 'Token已过期，请重新登录！');
					} else if (name === 'JsonWebTokenError' && message === 'invalid token') {
						return res.sendResult(null, 401, '无效的token，请重新登录！');
					} else if (name === 'JsonWebTokenError' && message === 'jwt malformed') {
						return res.sendResult(null, 401, 'token格式错误，请重新登录获取正确token！')
					}
					return res.sendResult(null, 401, err);
				}
				// next();
			});
			console.log('校验通过');
			next();
		}
	}
);


// 路由引入
// 用户相关业务模块
app.use('/users', require('./routes/users'));
app.use('/enterprises', require('./routes/enterprise'));



app.get('/test', (req, res, next) => {
	res.sendResult(null, 200, 'waterclound接口测试成功');
})
app.listen(port, () => console.log(`watercloud app listening on http://localhost:${port} !`))
