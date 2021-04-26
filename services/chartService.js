
const chartDao = require('../dao/chartDao');
const dayjs = require('dayjs');


module.exports.getWaterUseChartData = (taskId, field, dateValue, dataUnit, cb) => {
  let startTime = dateValue[0];
  let endTime = dateValue[1];
  chartDao.getCopyRecords(taskId, null, field, startTime, endTime, (err, res) => {
    if (err) {
      return cb(err);
    } else if (res) {
      if (dataUnit === 'day') {
        res.forEach(item => {
          item.Copy_time = dayjs(item.Copy_time).format('YYYY-MM-DD');
        });
      }
      let fieldDataUnitList = [];
      res.forEach(item => {
        let index = fieldDataUnitList.findIndex(ele => ele.copy_time === item.Copy_time);
        if (index === -1) {
          // 新
          fieldDataUnitList.push({
            data: item[field],
            copy_time: item.Copy_time
          });
        } else {
          fieldDataUnitList[index].data += item[field];
        }
      });
      return cb(null, fieldDataUnitList);
    }
  });
};

module.exports.getWaterEquipmentChartData = (taskId, equipment_code, field, dateValue, cb) => {
  let startTime = dateValue[0];
  let endTime = dateValue[1];
  chartDao.getCopyRecords(taskId, equipment_code, field, startTime, endTime, (err, res) => {
    if (err) {
      return cb(err);
    } else if (res) {
      let final = [];
      res.forEach(item => {
        final.push({
          data: item[field],
          copy_time: dayjs(item.Copy_time).format('YYYY-MM-DD HH:00')
        })
      });
      return cb(null, final);
    }
  })
}