
const bcrypt = require('bcryptjs')


str = "ssdtac"
async function hey() {
    const string = await bcrypt.hash(str, 8)
    console.log(string)
}
hey()


