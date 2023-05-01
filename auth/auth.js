const fs = require('fs');
const path = require("path");

// use cloudflare CA
const cloudflare_key = fs.readFileSync(path.resolve(path.join(__dirname, '..', 'ca', 'privkey.pem')));
const cloudflare_cert = fs.readFileSync(path.resolve(path.join(__dirname, '..', 'ca', 'myloa.pem')));

// use let' encrypt CA
//const letEncrypt_key = fs.readFileSync(path.resolve(path.join(__dirname, 'ca', 'privkey.pem')));
//const letEncrypt_cert = fs.readFileSync(path.resolve(path.join(__dirname, 'ca', 'cert.pem')));
//const letEncrypt_ca = fs.readFileSync(path.resolve(path.join(__dirname, 'ca', 'fullchain.pem')));

module.exports = {
    optionsCA: {
        key: cloudflare_key,
        cert: cloudflare_cert
    }
}