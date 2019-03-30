const crypto = require("crypto");
var public = crypto.createHmac("sha256", process.argv[2]).digest("hex");
var private = crypto.createHmac("sha256", public).digest("hex");
console.log(public);
console.log(private);