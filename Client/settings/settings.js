const fs = require('fs');
const config = require("./../config.json");
const shell = require("electron").shell;

function submit() {
    config.tipeeeapikey = document.getElementsByName("tipeeeapikey")[0].value;
    config.nimiqxapikey = document.getElementsByName("nimiqxapikey")[0].value;
    config.einfachmcapikey = document.getElementsByName("einfachmcapikey")[0].value;
    config.address = document.getElementsByName("address")[0].value;

    fs.writeFileSync("./config.json", JSON.stringify(config, null, 4));

    document.location.href = "./../home/index.html";
}

function openTab(link) {
    switch (link) {
        case "tipeee":
            shell.openExternal("https://www.tipeeestream.com/dashboard/api-key");
            break;
        case "nimiqx":
            shell.openExternal("https://account.nimiqx.com/keys");
            break;
        case "safe":
            shell.openExternal("https://safe.nimiq.com");
            break;
        case "discord":
            shell.openExternal("https://discord.gg/HDgyBa6");
    }
}

document.getElementsByName("tipeeeapikey")[0].value = config.tipeeeapikey;
document.getElementsByName("nimiqxapikey")[0].value = config.nimiqxapikey;
document.getElementsByName("einfachmcapikey")[0].value = config.einfachmcapikey;
document.getElementsByName("address")[0].value = config.address;

document.getElementById('submit').addEventListener('click', submit);

document.getElementById('tipeeelink').addEventListener('click', function () {
    openTab("tipeee");
});

document.getElementById('nimiqxlink').addEventListener('click', function () {
    openTab("nimiqx");
});

document.getElementById('safelink').addEventListener('click', function () {
    openTab("safe");
});

document.getElementById('discordlink').addEventListener('click', function () {
    openTab("discord");
});