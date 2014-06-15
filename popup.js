window.onload = function() {
  document.getElementById("query").focus();
};
var tabId = 0;

$(document).ready(function() {
	chrome.tabs.getSelected(null, function(tab) {
		tabId = tab.id;
		chrome.tabs.executeScript(tabId, {
			file: "jquery.js"
		});
		chrome.tabs.executeScript(tabId, {
			file: "highlight.js"
		});
		chrome.tabs.executeScript(tabId, {
			file: "jquery.scrollTo.min.js"
		});
		chrome.tabs.executeScript(tabId, {
			file: 'synonymhighlight.js'
		}, function() {
			chrome.tabs.sendMessage(tabId, ["initialize", ""]);
		});
	});
});

chrome.runtime.onMessage.addListener(function(message, sender) {
	$("#indexText").text((message.currentIndex + 1) + " of " + message.total);
});


$("#query").keyup(function (e) {
    if (e.keyCode == 13) {
        search();
    }
});

function search() {
	console.log("Highlighting synonyms on page: ");
	query = $("#query").val();
	chrome.tabs.sendMessage(tabId, ["query", query]);
}

$("#submit").click(function() {
	search();
});

$("#dehighlight").click(function() {
	chrome.tabs.sendMessage(tabId, ["dehighlight", ""]);
});

$("#previous").click(function() {
	chrome.tabs.sendMessage(tabId, ["previous", ""]);
});

$("#next").click(function() {
	chrome.tabs.sendMessage(tabId, ["next", ""]);
});