var databaseModules = require('../modules/database');

module.exports.saveFilePath = (fileObj) => {
  const { number, content, filepath, filename } = fileObj;
  const sql = `insert into history_charts_records values('${number}', '${content}', '${filepath}', '${filename}')`;
  const conn = databaseModules.getConnection();
  databaseModules.connect(conn);
  return new Promise((resolve, reject) => {
    conn.query(sql, (err, result) => {
      if (err) {
        reject(err);
      } else resolve(result);
    });
    conn.end();
  });
}