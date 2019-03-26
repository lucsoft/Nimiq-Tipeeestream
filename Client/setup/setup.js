const fs = require('fs');
const config = require("./../config.json");

function submit() {
    config.tipeeeapikey = document.getElementsByName("tipeeeapikey")[0].value;

    fs.writeFileSync("./config.json", JSON.stringify(config, null, 4));

    document.location.href = "./../home/index.html";
}

document.getElementById('submit').addEventListener('click', submit);