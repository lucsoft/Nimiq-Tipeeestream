const cp = require('child_process');
console.log(`${__dirname}/home.js`);
var child = cp.fork(`${__dirname}/home.js`);

child.on('message', message => {
  if (message.split(";")[0] == "[FATAL DUMMHEIT]") {
    console.log(message);
    alert(message);
  } else if (message.split(";")[0] == "[REDIRECT]") {
    window.location.href = message.split(";")[1];
  } else if (message.startsWith('Syncing')) {
    console.log(message);
    document.getElementById('syncstatus').innerHTML = message;
  } else {
    alert('message from child:' + message);
  }

});

child.on('error', error => {
  console.log(error);
});