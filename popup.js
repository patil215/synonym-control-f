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
			file: 'synonymhighlight.js'
		}, function() {
			chrome.tabs.sendMessage(tabId, ["initialize", ""]);
		});
	});
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

function dehighlight() {
	chrome.tabs.sendMessage(tabId, ["dehighlight", ""]);
}

$("#submit").click(function() {
	search();
});

$("#dehighlight").click(function() {
	dehighlight();
});