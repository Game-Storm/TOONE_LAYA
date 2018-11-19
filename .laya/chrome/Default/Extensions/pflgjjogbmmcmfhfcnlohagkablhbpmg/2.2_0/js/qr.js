jQuery(function(){
	$("#btn_gen").live("click",function(){
		jQuery('#qrDiv').html("");
		jQuery('#qrDiv').qrcode({
			text	: $("#qr_website").val()	//根据辞串生成第一个二维码
		});
	});
	
	window.version_m=2.2;
	if(localStorage["version_m"]!=window.version_m){
	    chrome.tabs.create({selected:true,url:"annou.html"})
	    localStorage["version_m"]=window.version_m
	}
	
	jQuery("#qr_a").on("click",function(){
		window.location.href="http://www.bejson.com/convert/qrcode/";
	});
	
	document.getElementById("copy").click=function(event){
	  var clipboardData = event.clipboardData || window.clipboardData;
	  return clipboardData.getData("text");
	};
});

chrome.tabs.getSelected(null,function(w){
jQuery('#qrDiv').qrcode({
			text	: w.url,
			width:"180",
			height:"180"
		});
		jQuery("#qr_webname").val(w.title);
		jQuery("#qr_website").val(w.url);
})





var click=function(info,tab){
   var url1 = "http://www.ostools.net/action/qrcode/generate?data="+tab.linkUrl;
    chrome.tabs.create({
        url:url1
    });
}

chrome.contextMenus.create({
        "title" : "当前连接生成二维码",
        "contexts" : ["link"],
        "onclick" : click
      });