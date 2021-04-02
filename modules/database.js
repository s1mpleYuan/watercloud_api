var mysql = require('mysql');
var logUtil = require('../utils/console');
var fs = require('fs');

let config_json = fs.readFileSync('./config/default.json');
const db_config = JSON.parse(config_json).db_config;

var conn = mysql.createConnection(db_config);

// console.log('数据库连接参数：%s', db_config);
logUtil.printPromptInfo('数据库连接成功,连接参数为:', db_config);

initDatabase = () => {
	conn.connect(err => {
		if (err) {
			console.log('[MySQL Connect Error]: Error Message=>%s', err.stack);
			return;
		}
	})
};

module.exports.getDatabase = () => {
	initDatabase();
	return conn;
};