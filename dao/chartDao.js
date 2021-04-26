const databaseModules = require('../modules/database');

module.exports.getCopyRecords = (taskId, equipment_code, field, startTime, endTime, cb) => {
  if (equipment_code) {
    var sql = `select ${field}, Copy_time from copy_record where Copy_time between '${startTime}' and '${endTime}' and Task_id = '${taskId}' and Equipment_code = '${equipment_code}'`;
  } else {
    var sql = `select ${field}, Copy_time from copy_record where Copy_time between '${startTime}' and '${endTime}' and Task_id = '${taskId}'`;
  }
  const conn = databaseModules.getConnection();
  databaseModules.connect(conn);
  conn.query(sql, (err, res) => {
    if (err) {
      cb(err);
    } else {
      let result = JSON.parse(JSON.stringify(res));
      cb(null, result);
    };
  });
  conn.end();
};