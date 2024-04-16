
const bcrypt = require('bcryptjs')


str = "ssdtac"

console.log(bcrypt.hash(str, 8))