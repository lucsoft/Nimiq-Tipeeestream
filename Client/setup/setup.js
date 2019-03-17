const electron = require('electron');
const fs = require("fs");
const settings = require("./../settings.json");

var BrowserWindow = electron.remote.BrowserWindow; //What the fuck JS?

var authorizationCode = window.location.href.split('&code=')[1];

if (authorizationCode) {
  console.log(authorizationCode);
  $.ajax({
    url: 'https://api.tipeeestream.com/oauth/v2/token',
    type: 'POST',
    data: "",
    success: function (data) {
      //window.location = "";
    }
  });

  document.getElementById('authorization').innerHTML = 'Authenticated: True';
}

function openAuthWindow() {
  var authUrl = 'https://api.tipeeestream.com/oauth/v2/auth?client_id=10582_2txchxs6jz8kkck0kwg04o8owkswcgg88scs84w8g48swoo04k&response_type=code&redirect_uri=https://einfachmc.de';
  
  authWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    'node-integration': false,
  });

  authWindow.loadURL(authUrl);
  authWindow.show();

  authWindow.webContents.on('did-frame-navigate', function (event, newUrl){
    if(newUrl.startsWith("https://einfachmc.de/?state=&code=")){
      alert(newUrl.split("https://einfachmc.de/?state=&code=")[1]);
      settings.sessionToken = newUrl.split("https://einfachmc.de/?state=&code=")[1];
      console.log(settings);
      fs.writeFileSync("./../settings.json", JSON.stringify(users, null, 4), null);
      authWindow.close();
    }
  })

  authWindow.on('closed', function () {
    authWindow = null;
  });
}

module.exports = {
  openAuthWindow: openAuthWindow
}