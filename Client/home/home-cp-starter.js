const cp = require('child_process');
const EventEmitter = require('events').EventEmitter;
const emitter = new EventEmitter();

var child = cp.fork(`${__dirname}/home.js`);

child.on("message", function (msg) {
  emitter.emit(msg.eventType, msg.body);
})

emitter.on('sync-complete', function (msg) {
  document.getElementById("syncstatus").style.display = "none";
})

emitter.on('redirect', function (msg) {
  window.location.href = msg;
})

emitter.on('syncing', function (msg) {
  console.log(msg);
  document.getElementById('syncstatus').innerHTML = msg;
});

emitter.on('message', function (msg) {
  alert(message);
})

child.on('error', error => {
  console.log(error);
});