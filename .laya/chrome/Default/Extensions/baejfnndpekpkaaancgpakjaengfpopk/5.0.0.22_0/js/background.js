var vd = {};
vd.tabsData = {};
vd.linksToBeDownloaded = {};
vd.videoFormats = {
    "mp4": {
        type: "mp4"
    },
    "flv": {
        type: "flv"
    },
    "mov": {
        type: "mov"
    },
    "webm": {
        type: "webm"
    }
};

vd.isVideoUrl = function (url) {
    var isVideoUrl = false;
    Object.keys(vd.videoFormats).some(function (format) {
        if (url.indexOf(format) != -1) {
            isVideoUrl = true;
            return true;
        }
    });
    return isVideoUrl;
};

vd.getVideoType = function (responseHeaders) {
    var videoType = null;
    responseHeaders.some(function (responseHeader) {
        if (responseHeader.name == 'Content-Type') {
            Object.keys(vd.videoFormats).forEach(function (formatKey) {
                if (responseHeader.value.indexOf(formatKey) != -1 && !/^audio/i.test(responseHeader.value)) {
                    videoType = formatKey;
                    return true;
                }
            });
            return true;
        }
    });
    return videoType;
};

vd.getNewTabObject = function () {
    return {
        videoLinks: [],
        url: ""
    }
};

vd.getVideoSize = function (videoHeaders) {
    var size = 0;
    videoHeaders.forEach(function (header) {
        if (header.name == "Content-Length") {
            size = parseInt(header.value);
        }
    });
    return size;
};

vd.getVideoDataFromServer = function (url, callback) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === 2) {
            callback({mime: this.getResponseHeader("Content-Type"), size: this.getResponseHeader("Content-Length")});
            request.abort();
        }
    };
    request.open('Get', url);
    request.send();
};

vd.getFileName = function (str) {
    // console.log(str);
    var regex = /[A-Za-z0-9()_ -]/;
    var escapedStr = "";
    str = Array.from(str);
    str.forEach(function (char) {
        if (regex.test(char)) {
            escapedStr += char;
        }
    });
    return escapedStr;
};

vd.isVideoLinkAlreadyAdded = function (videoLinksData, url) {
    // console.log("URL " + url);
    // console.log(videoLinksData);
    var isAlreadyAdded = false;
    videoLinksData.some(function (videoLinkData) {
        if (videoLinkData.url === url) {
            isAlreadyAdded = true;
            return true;
        }
    });
    // console.log("Is already added: "+ isAlreadyAdded);
    return isAlreadyAdded;
};

vd.updateExtensionIcon = function (tabId) {
    if (vd.tabsData[tabId] && vd.tabsData[tabId].videoLinks.length > 0) {
        chrome.browserAction.setIcon({tabId: tabId, path: "../images/download_active.png"})
    } else {
        chrome.browserAction.setIcon({tabId: tabId, path: "../images/download_inactive.png"})
    }
};

vd.addVideoLinkToTabFinalStep = function (tabId, videoLink) {
    // console.log("Trying to add url "+ videoLink.url);
    if (!vd.isVideoLinkAlreadyAdded(vd.tabsData[tabId].videoLinks, videoLink.url) && videoLink.size > 1024 && vd.isVideoUrl(videoLink.url)) {
        vd.tabsData[tabId].videoLinks.push(videoLink);
        vd.updateExtensionIcon(tabId);
    }
};

vd.addVideoLinkToTab = function (videoLink, tabId, tabUrl) {
    console.log(videoLink);
    if (!vd.tabsData[tabId]) {
        vd.tabsData[tabId] = vd.getNewTabObject();
    }
    if (tabUrl != vd.tabsData[tabId].url) {
        vd.tabsData[tabId].videoLinks = [];
        vd.tabsData[tabId].url = tabUrl;
    }
    if (!videoLink.size) {
        console.log("Getting size from server for " + videoLink.url);
        vd.getVideoDataFromServer(videoLink.url, function (videoData) {
            videoLink.size = videoData.size;
            vd.addVideoLinkToTabFinalStep(tabId, videoLink);
        });
    } else {
        vd.addVideoLinkToTabFinalStep(tabId, videoLink);
    }

};

vd.inspectNetworkResponseHeaders = function (details) {
    var videoType = vd.getVideoType(details.responseHeaders);
    if (vd.linksToBeDownloaded[details.url]) {
        details.responseHeaders.push({
            name: "Content-Disposition",
            value: "attachment; filename=\"" + vd.linksToBeDownloaded[details.url] + "\""
        });
        return {
            responseHeaders: details.responseHeaders
        };
    }
    if (videoType) {
        console.log("Detected new link");
        console.log(details.url);
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            var tab = tabs[0];
            var tabId = tab.id;
            vd.addVideoLinkToTab({
                url: details.url,
                size: vd.getVideoSize(details.responseHeaders),
                fileName: vd.getFileName(tab.title),
                extension: "." + videoType
            }, tabId, tab.url);
        });
    }
};

vd.addVideoLinks = function (videoLinks, tabId, tabUrl) {
    if (!vd.tabsData[tabId]) {
        vd.tabsData[tabId] = vd.getNewTabObject();
    }
    if (tabUrl != vd.tabsData[tabId].url) {
        vd.tabsData[tabId].videoLinks = [];
        vd.tabsData[tabId].url = tabUrl;
    }
    videoLinks.forEach(function (videoLink) {
        // console.log(videoLink);
        videoLink.fileName = vd.getFileName(videoLink.fileName);
        vd.addVideoLinkToTab(videoLink, tabId, tabUrl);
    });
};

vd.getVideoLinksForTab = function (tabId) {
    if (vd.tabsData[tabId]) {


        return vd.tabsData[tabId];

    } else {
        return {};
    }
};

vd.incrementDownloadCount = function () {
    var numberOfDownloads = parseInt(localStorage.getItem('total_number_of_downloads'));
    numberOfDownloads += 1;
    localStorage.setItem('total_number_of_downloads', numberOfDownloads);
    if (numberOfDownloads == 3) {
        if (confirm("You have downloaded multiple videos with Video Downloader Plus. Please share your experience with others and make a review for us.")) {
            chrome.tabs.create({
                "url": "https://chrome.google.com/webstore/detail/video-downloader-plus/baejfnndpekpkaaancgpakjaengfpopk/reviews",
                "selected": true
            }, function (tab) {
            });
        }
       ga_Event( "usage", 'alert', 'numberOfDownloads3');
    }
    if (numberOfDownloads == 7) {
        if (confirm("If you like what we made for you, please give us a 5 star review. We are glad to help you. ")) {
            chrome.tabs.create({
                "url": "https://chrome.google.com/webstore/detail/video-downloader-plus/baejfnndpekpkaaancgpakjaengfpopk/reviews",
                "selected": true
            }, function (tab) {
            });
        }
       ga_Event( "usage", 'alert', 'numberOfDownloads7');
    }
};

vd.downloadVideoLink = function (url, fileName) {
    // console.log(url+" : " + fileName);

    vd.linksToBeDownloaded[url] = fileName;
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.update(tabs[0].id, {"url": url, "selected": false}, function (tab) {
        });
        vd.incrementDownloadCount();
    });
};

vd.showYoutubeWarning = function () {
   ga_Event( "usage", 'alert', 'showYoutubeWarning');

    if (confirm("Video Downloader Plus cannot download from Youtube.")) {

    }


};

chrome.tabs.onUpdated.addListener(function (tabId) {
    vd.updateExtensionIcon(tabId);
});

chrome.tabs.onRemoved.addListener(function (tabId) {
    if (vd.tabsData[tabId]) {
        delete vd.tabsData[tabId];
    }
});

chrome.webRequest.onHeadersReceived.addListener(vd.inspectNetworkResponseHeaders, {urls: ["<all_urls>"]}, ["blocking", "responseHeaders"]);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    // console.log(request);
    // console.log(sender);
    switch (request.message) {
        case "add-video-links":
            vd.addVideoLinks(request.videoLinks, sender.tab.id, sender.tab.url);
            break;
        case "get-video-links" :
            sendResponse(vd.getVideoLinksForTab(request.tabId));
            break;
        case "download-video-link" :
            vd.downloadVideoLink(request.url, request.fileName);
            break;
        case "show-youtube-warning" :
            vd.showYoutubeWarning();
            break;
    }
});
