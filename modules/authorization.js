var path = require('path');


module.exports.getService = (serviceName) => {
  // 校验通过

  var serviceModule = path.join(process.cwd(),`services/${serviceName}`);
  if (!serviceModule) {
    console.error(`${serviceName}模块不存在`);
    return null;
  }
  return serviceModule;
}