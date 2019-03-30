process.on('uncaughtException', function (err) {
    process.send("[FATAL DUMMHEIT]; " + err);
})

process.on('unhandledRejection', function (err) {
    process.send("[FATAL DUMMHEIT]; " + err);
})

process.on('warning', function (warn) {
    process.send("[WARNING]; " + warn);
});

const request = require("request");
const config = require(`${__dirname}/../config.json`);
const messages = require(`${__dirname}/../messages.json`);
const db = require("better-sqlite3")(`${__dirname}/../donations.db`);

var c_transactions = [];
var c_donations = [];

var nimiqusd;

class cl_transaction {
    constructor(data) {
        this.data = data;
    }
}

class cl_donation {
    constructor(data) {
        this.data = data;
    }
}

function requestNIMPrice() {
    request.get("https://api.coincap.io/v2/assets/nimiq", null, function (err, response, body) {
        nimiqusd = JSON.parse(body).data.priceUsd;
    });
}

function requestAddressTransactions() {
    request.get(`https://api.nimiqx.com/account-transactions/${config.address}/2?api_key=${config.nimiqxapikey}`, null, function (err, response, body) {
        var transactions = JSON.parse(body);

        for (tx in transactions) {
            var o_transaction = new cl_transaction(transactions[tx]);
            c_transactions[o_transaction.data.message] = o_transaction;
            console.log(o_transaction.data.message)
        }
    })
}

async function requestNewDonations() {
    var date = [];
    date = await db.prepare("SELECT timestamp FROM donations ORDER BY timestamp desc LIMIT 1").all();
    if (date.length == 0) {
        date[0] = {
            "timestamp": 0
        }
    }

    var newDonations = await new Promise(function (resolve, reject) {
        //This api key has no function sorry :(
        request.get(`http://localhost:3000/getnewdonations?apikey=71cdfa32087e4c9906d405c7de8baeeaeeefc6edc4513e157a7be1c958c0c7e9&date=${date[0].timestamp}`, function (err, response, body) {
            if (!err && response.statusCode == 200) {
                resolve(body);
            } else {
                reject(messages.noconnectiontoserver);
            }
        });
    });
    var newDonations = JSON.parse(newDonations);
    for (donation in newDonations) {
        process.send("Syncing: " + (new Date(newDonations[donation].timestamp)).toISOString());
        db.prepare("INSERT INTO donations (nimiqmsg, user, amount, timestamp, streamer, done) VALUES (@nimiqmsg, @user, @amount, @timestamp, @streamer, @done)").run(newDonations[donation]);
    }
}

async function loadDonationsDB() {
    var donations = await db.prepare("SELECT * FROM donations WHERE done IS null").all();
    for (donation in donations) {
        var o_donation = new cl_donation(donations[donation]);
        c_donations[o_donation.data.nimiqmsg] = o_donation;
    }
}

function checkDonationArrived() {
    for (o_donation in c_donations) {
        if (c_transactions[c_donations[o_donation].data.nimiqmsg]) {
            var o_transaction = c_transactions[c_donations[o_donation].data.nimiqmsg];
            process.send("Donation arrived!");
            request.post({
                url: `https://api.tipeeestream.com/v1.0/users/einfachalexyt/events.json?apiKey=${config.tipeeeapikey}&type=donation&params[username]=[Nimiq]${c_donations[o_donation].data.user}&params[amount]=${(o_transaction.data.value) / 10000 * nimiqusd}&params[currency]=USD`,
            }, function (err, response, body) {
                console.log(body);
            });
            db.prepare("UPDATE donations SET done = 'X' WHERE (nimiqmsg) IS (?)").run(c_donations[o_donation].data.nimiqmsg);
            delete c_donations[o_donation];
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////
if (!config.tipeeeapikey || !config.nimiqxapikey || !config.address) {
    process.send(`[REDIRECT];${__dirname}/../settings/index.html`);
    return;
}

requestNewDonations();
requestAddressTransactions();
loadDonationsDB();
requestNIMPrice();
checkDonationArrived();

setInterval(function () {
    requestNewDonations()
    requestAddressTransactions();
    loadDonationsDB();
    requestNIMPrice();
    checkDonationArrived();
}, 30000);