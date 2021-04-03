
var authorization = require('../modules/authorization');

var token = authorization.createToken('yqy');

// console.log(token);

authorization.tokenAuth(token, (err, decode) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(decode);
})

