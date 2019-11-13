const cryptoJs = require('crypto-js')

exports.decrypt = req => {
    const bytes = cryptoJs.AES.decrypt(req.body.data, process.env.CRYPTOSECRETKEY);
    return JSON.parse(bytes.toString(cryptoJs.enc.Utf8))
}
