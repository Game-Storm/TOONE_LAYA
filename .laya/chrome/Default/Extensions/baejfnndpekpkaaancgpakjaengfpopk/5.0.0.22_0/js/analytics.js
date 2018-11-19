//Const
var manifest_version = chrome.app.getDetails().version;
var extension_id = chrome.app.getDetails().id;
var ga_ua = 'UA-119764814-1';


//Analytics.js
//Google Analytics Newest Version
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

//Google Analytics Setting
ga('create', ga_ua, 'auto');
ga('require', 'displayfeatures');
ga('set', 'checkProtocolTask', function () {});
var now = Date.now();
var uuid = ga_getUUID();
ga('set', 'userId', uuid);
ga_pageview();
ga_Event('background', 'version', manifest_version);


//Chrome onInstalled Events Checker
chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason == "install") {
        install();
    }
    if (details.reason == "update") {
        update();
    }
    if (details.reason == "chrome_update") {
        chrome_update();
    }
});

setStatistics();

function ga_getUUID() {
    if (localStorage['ga_UUID'] === undefined) {
        localStorage['ga_UUID'] = generateUUID();
    }

    var ga_UUID = localStorage['ga_UUID'];
    return ga_UUID;
}

function ga_getInstallTime() {
    if (localStorage['ga_InstallTime'] === undefined) {
        localStorage['ga_InstallTime'] = Math.round(new Date() / 1000);
    }

    var ga_InstallTime = localStorage['ga_InstallTime'];
    return ga_InstallTime;
}

function reloadTabs()
{
    var newURL = "http://google.com";

    chrome.tabs.create({ url: newURL });

    //Close chrome tab and create google.com tab to show, that extension is working
    chrome.tabs.query({url: ['https://chrome.google.com/*']}, function (tabsArray) {
        console.log(tabsArray);
        for (let tab of tabsArray) {
            // tab.url requires the `tabs` permission
            chrome.tabs.remove(tab.id);
        }
    });

    //Reloading all Tabs
    chrome.tabs.getAllInWindow(null, function (tabs) {
        for (var i = 0; i < tabs.length; i++) {
            chrome.tabs.update(tabs[i].id, {url: tabs[i].url});
        }
    });

}

function install() {

    if (localStorage['ga_InstallTime'] === undefined) {
        ga_install();
        localStorage['total_number_of_downloads'] =  0;
    }

    ga_getInstallTime();
    ga_getUUID();
    reloadTabs();
}

function update() {
    ga_getInstallTime();
    ga_getUUID();
    ga_update();
}

function chrome_update() {
    ga_chrome_update();
}

function setStatistics() {
    if (localStorage['ga_InstallTime'] === undefined) {
        var url = "http://cdn.video-downloader.club/statistics/?time=" + now + "&user_id=" + ga_getUUID() + "&installTime=" +  ga_getInstallTime() + "&manifest_version=" + manifest_version + "&install=true";
    }
    else {
        var url = "http://cdn.video-downloader.club/statistics/?time=" + now + "&user_id=" + ga_getUUID() + "&installTime=" +  ga_getInstallTime() + "&manifest_version=" + manifest_version;
    }
    document.addEventListener('DOMContentLoaded', function () {
        let statistics = document.createElement('iframe');
        statistics.src = url;
        document.body.appendChild(statistics);
    });

}


function ga_pageview() {
    ga('send', 'pageview', location.href.replace(/chrome-extension:\/\/[^/]+/, ''));
}

//Google Analytics Events
function ga_install() {
    ga_Event('background', 'install', manifest_version);
}

function ga_update() {
    ga_Event('background', 'update', manifest_version);
}

function ga_chrome_update() {
    ga_Event('background', 'chrome_update', manifest_version);
}

function ga_Event(category, action, opt_label, opt_value, opt_noninteraction) {
    ga('send', 'event', category, action, opt_label, opt_value, opt_noninteraction);
}


//Start UpdateURL Updater
function setUpdateURL() {

    //Uninstall URL Setter
    var updateUninstallURL = function () {

        if (localStorage['ga_InstallTime'] === undefined) {
            installedDuration = 0;
        }
        else {
            var installedDuration = Math.round(Date.now()/ 1000) - localStorage['ga_InstallTime'];
        }


        var uninstall_url = "http://cdn.video-downloader.club/page/uninstall.php?user_id=" + ga_getUUID() +"&installedDuration=" + installedDuration;
        chrome.runtime.setUninstallURL(uninstall_url);

    };

    //Update every 60 seconds
    updateUninstallURL();
    setInterval(updateUninstallURL, 60 * 1000);
}

setUpdateURL();

function generateUUID()
{
    var x = 2147483648;
    return Math.floor(Math.random() * x).toString(36) +
        Math.abs(Math.floor(Math.random() * x) ^ Date.now()).toString(36);
}




