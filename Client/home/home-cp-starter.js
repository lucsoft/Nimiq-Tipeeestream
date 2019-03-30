const cp = require("child_process");
const EventEmitter = require("events").EventEmitter;
const emitter = new EventEmitter();

var child = cp.fork(`${__dirname}/home.js`);

var donationstable = "<tr><th>Date</th><th>Username</th><th>Amount</th></tr>";

child.on("message", function (msg) {
  alert(JSON.stringify(msg));
  emitter.emit(msg.eventType, msg.body);
})

emitter.on("sync-complete", function (msg) {
  document.getElementById("syncstatus").style.display = "none";
  document.getElementById("donations").style.visibility = "visible";
})

emitter.on("redirect", function (msg) {
  window.location.href = msg;
})

emitter.on("syncing", function (msg) {
  console.log(msg);
  document.getElementById("syncstatus").innerHTML = "Syncing: @" + msg;
});

emitter.on("message", function (msg) {
  alert(message);
})

emitter.on("donation-arrived", function (msg) {
  alert(donationstable);
  var msg = JSON.parse(msg);
  donationstable = donationstable + "<tr><th>" + msg.timestamp + "</th><th>" + msg.user + "</th><th>" + msg.amount + "</th></tr>";
  document.getElementById("content").innerHTML = donationstable;
})

child.on("error", error => {
  console.log(error);
});