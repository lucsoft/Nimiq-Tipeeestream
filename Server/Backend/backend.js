const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const db = require("better-sqlite3")("./../../donations.db");
const config = require("./../../config.json");
const streamers = require("./streamers.json");
var app = express();

db.pragma('journal_mode = WAL');

let urlencodedParser = bodyParser.urlencoded({
    extended: true
});

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', '*');
    next()
})

app.post('/newdonation', urlencodedParser, async function (req, res) {

    var nimiqMsg = crypto.createHmac("sha256", (JSON.stringify(req.body) + " " + Date.now() + Math.random(100000)).toString()).digest('hex');
    
    //ToDo: Check for missing values / fail values
    await db.prepare("INSERT INTO donations (nimiqmsg, user, amount, timestamp, streamer) VALUES (?, ?, ?, ?, ?)").run(nimiqMsg, req.body.user, req.body.amount, Date.now(), req.body.streamer);

    res.json({
        success: true,
        address: config.address.replace(/\s/g, ''),
        amount: req.body.amount,
        nimiqMsg: nimiqMsg
    });
});

app.get('/getnewdonations', urlencodedParser, async function (req, res){
    var streamer = streamers[crypto.createHmac("sha256", req.query.apikey).digest('hex')];
    var donations = await db.prepare("SELECT * FROM donations WHERE (streamer) = (?) AND (timestamp) > (?)").all(streamer, req.query.date);
    res.send(donations);
})


app.listen(3000, function () {
    console.log("Started on PORT 3000");
});