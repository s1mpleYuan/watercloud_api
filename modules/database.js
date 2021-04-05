// var logUtil = require('../utils/console');
const mysql = require('mysql');

// mysql.createConnection
const db_config = require("config").get("db_config");

module.exports.connect = (conn, cb) => {
	conn.connect(err => {
		if (err) {
			cb(err);
			return;
		}
		console.log('数据库已连接');
	});
}

module.exports.getConnection = () => {
	return conn = mysql.createConnection(db_config);
}