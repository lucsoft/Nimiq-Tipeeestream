const request = require("request");
const config = require("./../config.json");
const db = require("better-sqlite3")("./../donations.db");

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

function loadAccountTransactions() {
    request.get(`https://api.nimiqx.com/account-transactions/${config.address}/2?api_key=${config.nimiqxapikey}`, null, function (err, response, body) {
        var transactions = JSON.parse(body);

        for (tx in transactions) {
            var o_transaction = new cl_transaction(transactions[tx]);
            c_transactions[o_transaction.data.message] = o_transaction;
            console.log(o_transaction.data.message)
        }
    })
}

function loadDonations() {
    var donations = db.prepare("SELECT * FROM donations WHERE done IS null").all();
    for (donation in donations) {
        var o_donation = new cl_donation(donations[donation]);
        c_donations[o_donation.data.nimiqmsg] = o_donation;
    }
}

function loadNimiqPrice() {
    request.get("https://api.coincap.io/v2/assets/nimiq", null, function (err, response, body) {
        nimiqusd = JSON.parse(body).data.priceUsd;
    });
}

function checkDonationArrived() {
    for (o_donation in c_donations) {
        if (c_transactions[c_donations[o_donation].data.nimiqmsg]) {
            var o_transaction = c_transactions[c_donations[o_donation].data.nimiqmsg];
            console.log("Donation arrived!");
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

loadAccountTransactions();
loadDonations();
loadNimiqPrice();
checkDonationArrived();

setInterval(function () {
    loadAccountTransactions();
    loadDonations();
    loadNimiqPrice();
    checkDonationArrived();
}, 300000);