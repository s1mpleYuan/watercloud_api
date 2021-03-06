const databaseModule = require('../modules/database');


module.exports.queryWaterMeterCopyRecords = (sql, cb) => {
  const conn = databaseModule.getConnection();
  databaseModule.connect(conn);
  conn.query(sql, (err, res) => {
    if (err) {
      cb(err);
    } else return cb(null, res);
  });
  conn.end();
};