var path = require('path');

var jwt = require('jsonwebtoken');
var jwt_config = require('config').get('jwt_config');



module.exports.createToken = (uid, sub) => {
  var token = jwt.sign({ "uid": uid, "sub": sub }, jwt_config.get("secretKey"), { "expiresIn": jwt_config.get("expiresIn") });
  return "Bearer " + token;
}