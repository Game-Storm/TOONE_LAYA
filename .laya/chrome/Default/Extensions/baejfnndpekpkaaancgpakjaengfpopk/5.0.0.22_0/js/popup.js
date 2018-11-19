(function () {
    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
})();

var manifest_version = chrome.app.getDetails().version;
var now = Date.now();
var _gaq = _gaq || [];

_gaq.push(['_setAccount', 'UA-119764814-1']);
_gaq.push(['_trackPageview']);
_gaq.push(['_trackEvent', "background", 'version', manifest_version]);


var vd = {};

vd.sendMessage = function (message, callback) {
    chrome.runtime.sendMessage(message, callback);
};

vd.createDownloadSection = function (videoData) {
    return '<li class="video"> \
        <a class="play-button" href="' + videoData.url + '" target="_blank"></a> \
        <div class="title" title="' + videoData.fileName + '">' + videoData.fileName + '</div> \
        <a class="download-button" href="' + videoData.url + '" data-file-name="' + videoData.fileName + videoData.extension + '">Download - ' + Math.floor(videoData.size * 100 / 1024 / 1024) / 100 + ' MB</a>\
        <div class="sep"></div>\
        </li>';
};

$(document).ready(function () {
    var videoList = $("#video-list");
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        console.log(tabs);
        vd.sendMessage({message: 'get-video-links', tabId: tabs[0].id}, function (tabsData) {
            console.log(tabsData);
            if (tabsData.url.indexOf('youtube.com') != -1) {
                vd.sendMessage({message: 'show-youtube-warning'});
                return
            }
            var videoLinks = tabsData.videoLinks;
            console.log(videoLinks);
            if (videoLinks.length == 0) {
                $("#no-video-found").css('display', 'block');
                videoList.css('display', 'none');
                return
            }
            $("#no-video-found").css('display', 'none');
            videoList.css('display', 'block');
            videoLinks.forEach(function (videoLink) {
                videoList.append(vd.createDownloadSection(videoLink));
            })
        });
    });
    $('body').on('click', '.download-button', function (e) {
        e.preventDefault();
        vd.sendMessage({
            message: 'download-video-link',
            url: $(this).attr('href'),
            fileName: $(this).attr('data-file-name')
        });
    });
});