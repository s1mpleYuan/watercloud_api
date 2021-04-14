// var logUtil = require('../utils/console');
const mysql = require('mysql');

// mysql.createConnection
const db_config = require("config").get("db_config");

module.exports.connect = (conn) => {
	conn.connect(err => {
		if (err) {
			// 连接失败 继续重新连接
			setTimeout(this.connect(conn), 2000);
		}
	});
}

module.exports.getConnection = () => {
	return conn = mysql.createConnection(db_config);
}