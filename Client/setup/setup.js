const fs = require('fs');
const config = require("./../config.json");
const shell = require("electron").shell;

function submit() {
    config.tipeeeapikey = document.getElementsByName("tipeeeapikey")[0].value;

    fs.writeFileSync("./config.json", JSON.stringify(config, null, 4));

    document.location.href = "./../home/index.html";
}

function openTipeee() {
    shell.openExternal("https://www.tipeeestream.com/dashboard/api-key");
}

document.getElementById('submit').addEventListener('click', submit);

document.getElementById('tipeeelink').addEventListener('click', openTipeee);