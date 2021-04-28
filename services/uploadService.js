const uploadDao = require('../dao/uploadDao');

module.exports.saveImageFilePath = (obj) => {
  return uploadDao.saveFilePath(obj);
}