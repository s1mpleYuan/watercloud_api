var jwt = require('jsonwebtoken');
var jwt_config = require('config').get('jwt_config');



module.exports.createToken = (uid = jwt_config.get("uid"), sub = jwt_config.get("sub")) => {
  var header = {
    "iss": uid,
    "sub": sub
  };
  const token = jwt.sign(header, jwt_config.get("secretKey"), { "expiresIn": jwt_config.get("expiresIn") });
  // var token = jwt.sign({ "uid": uid, "sub": sub }, jwt_config.get("secretKey"), { "expiresIn": jwt_config.get("expiresIn") });
  return token;
}

module.exports.tokenAuth = (token, cb) => {
  jwt.verify(token, jwt_config.get("secretKey"), (err, decode) => {
    if (err) {
      return cb(err);
    }
    return cb(null, decode);
  })
}