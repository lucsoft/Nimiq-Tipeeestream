const cp = require('child_process');
var child = cp.fork("./home/home.js");


child.on('message', message => {
  if (message.split(";")[0] == "[FATAL DUMMHEIT]") {
    console.log(message);
    alert(message);
  } else if (message.split(";")[0] == "[REDIRECT]"){
    console.log(message.split(";")[1])
    window.location.href = message.split(";")[1];
  } else if (message.startsWith('Syncing')){
    console.log(message);
    document.getElementById('syncstatus').innerHTML = message;
  } else {
    console.log('message from child:', message);
  }

});

child.on('error', error => {
  console.log(error);
});