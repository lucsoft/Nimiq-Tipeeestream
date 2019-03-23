const cp = require('child_process');
var child = cp.fork("./donations-backend.js");

child.on('message', message => {
  console.log('message from child:', message);
  document.getElementById('syncstatus').innerHTML = message;
});