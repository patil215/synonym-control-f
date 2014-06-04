chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	alert(message);
	$("body").highlight(message);
	$(".highlight").css({
		backgroundColor: "#FFFF88"
	});
});