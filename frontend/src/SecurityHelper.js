import cryptoJs from 'crypto-js'

export const Encrypt = data => cryptoJs.AES.encrypt(JSON.stringify(data), 'secret').toString()
