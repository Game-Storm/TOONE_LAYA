var vd = {};

vd.sendMessage = function (message, callback) {
    chrome.runtime.sendMessage(message, callback);
};

vd.videoFormats = ['mp4', "mov", "flv", "webm"];

vd.escapeRegExp = function (str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
};

vd.getVideoType = function (link) {
    var videoType = null;
    vd.videoFormats.some(function (format) {
        if (new RegExp(vd.escapeRegExp('.' + format)).test(link)) {
            videoType = format;
            return true;
        }
    });
    return videoType;
};

vd.getAbsolutePath = function (link) {
    console.log(link);
    var protocol = window.location.protocol;
    if (new RegExp("^" + protocol + "//").test(link)) {
        return link;
    }
    if (new RegExp('^//').test(link)) {
        return protocol + link;
    }
    var stack = window.location.href.split("/"),
        parts = link.split("/");
    stack.pop(); // remove current file name (or empty string)
                 // (omit if "base" is the current folder without trailing slash)
    for (var i = 0; i < parts.length; i++) {
        if (parts[i] == ".")
            continue;
        if (parts[i] == "..")
            stack.pop();
        else
            stack.push(parts[i]);
    }
    return stack.join("/");
};

vd.getLinkTitleFromNode = function (node) {
    var title = node.attr('title') ? node.attr('title') : node.attr('alt') ? node.attr('alt') : node.text().trim();
    return title ? title : document.title;
};

vd.getVideoLinks = function (node) {
    console.log(node);
    var videoLinks = [];
    $(node).find('a').each(function () {
        var link = $(this).attr('href');
        var videoType = vd.getVideoType(link);
        if (videoType) {
            videoLinks.push({url: link, fileName: vd.getLinkTitleFromNode($(this)), extension: "." + videoType});
        }
    });
    $(node).find('video').each(function () {
        // console.log(this);
        var nodes = [];
        // console.log($(this).attr('src'));
        $(this).attr('src') ? nodes.push($(this)) : void 0;
        // console.log(nodes);
        $(this).find('source').each(function () {
            nodes.push($(this));
        });
        nodes.forEach(function (node) {
            var link = node.attr('src');
            if (!link) {
                return
            }
            var videoType = vd.getVideoType(link);
            videoLinks.push({url: link, fileName: vd.getLinkTitleFromNode(node), extension: "." + videoType})
        });
    });
    return videoLinks;
};

vd.mutationObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        var addedNodes = mutation.addedNodes;
        addedNodes.forEach(function (node) {
            // console.log(node);
            vd.findVideoLinks(node);
        });
    });
});

vd.sendVimeoVideoLinks = function () {
    var videoLinks = [];
    var dataUrl = $("div[data-config-url]").attr('data-config-url');
    $.get(dataUrl, function (response) {
        // console.log(response);
        response = typeof response == 'string' ? JSON.parse(response) : response;
        var title = response.video.title;
        response.request.files.progressive.forEach(function (obj) {
            videoLinks.push({url: obj.url, fileName: title, extension: "." + vd.getVideoType(obj.url)})
        });
        vd.sendVideoLinks(videoLinks);
    });
};

vd.sendVideoLinks = function (videoLinks) {
    // if(videoLinks.length == 0) { return }
    videoLinks.forEach(function (videoLink) {
        videoLink.url = vd.getAbsolutePath(videoLink.url);
    });
    vd.sendMessage({message: 'add-video-links', videoLinks: videoLinks});
};

vd.findVideoLinks = function (node) {
    var videoLinks = [];
    switch (window.location.host) {
        case "vimeo.com":
            vd.sendVimeoVideoLinks();
            break;
        case "www.youtube.com":
            break;
        default:
            videoLinks = vd.getVideoLinks(node);
    }
    vd.sendVideoLinks(videoLinks);

};

vd.init = function () {
    vd.findVideoLinks(document.body);
};

vd.init();

chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    switch (request.message) {
        case "":
            break;
    }
});