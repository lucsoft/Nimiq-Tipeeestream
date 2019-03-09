const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const db = require("better-sqlite3")("./../../donations.db");
const config = require("./../../config.json");
var app = express();

let urlencodedParser = bodyParser.urlencoded({
    extended: true
});

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', '*');
    next()
})

app.post('/newdonation', urlencodedParser, async function (req, res) {

    console.log(req.body);

    var nimiqMsg = crypto.createHmac("sha256", (JSON.stringify(req.body) + " " + Date.now()).toString()).digest('hex');
    var kiddy = await db.prepare("INSERT INTO donations (nimiqmsg, user, amount, timestamp) VALUES (?, ?, ?, ?)").run(nimiqMsg, req.body.user, req.body.amount, Date.now());

    res.json({
        success: true,
        address: config.address.replace(/\s/g, ''),
        amount: req.body.amount,
        nimiqMsg: nimiqMsg
    });
});

app.listen(3000, function () {
    console.log("Started on PORT 3000");
});