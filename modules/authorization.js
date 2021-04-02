var path = require('path');

var jwt = require('jsonwebtoken');
var jwt_config = require('config').get('jwt_config');

function createToken(uid, sub) {
  var token = jwt.sign({ "uid": uid, "sub": sub }, jwt_config.get("secretKey"), { "expiresIn": jwt_config.get("expiresIn") });
  return "Bearer " + token;
}

/**
 * 
 * @param {*} uid 签发人
 * @param {*} sub 主题 默认为local_token
 */
module.exports.getToken = (uid, sub = 'local_token') => {
  return createToken(uid, sub);
}