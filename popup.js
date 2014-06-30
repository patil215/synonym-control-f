var lastQueryInput;


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
	switch(message.command) {
		case "IndexUI":
			if(message.total == 0) {
				$("#indexText").text("0 of 0");
			} else {
				$("#indexText").text((message.currentIndex + 1) + " of " + message.total);
			}
			break;
		case "TextBox":
			$("#query").val(message.queryText);
			$("#query").focus();
			break;
	}
});


$("#query").keyup(function (e) {
    if (e.keyCode == 13) {
    	// If it's the same query, go to the next result, otherwise, do a new search
    	if($("#query").val() == lastQueryInput) {
    		chrome.tabs.sendMessage(tabId, ["next", ""]);
    	} else {
        	search();
    	}
    }
});

function search() {
	console.log("Highlighting synonyms on page: ");
	query = $("#query").val();
	lastQueryInput = query;
	chrome.tabs.sendMessage(tabId, ["dehighlight", ""]);
	chrome.tabs.sendMessage(tabId, ["query", query]);
}

$("#submit").click(function() {
	search();
});

$("#dehighlight").click(function() {
	$("#indexText").text("0 of 0");
	$("#query").val("");
	$("#query").focus();
	chrome.tabs.sendMessage(tabId, ["dehighlight", ""]);
});

$("#previous").click(function() {
	chrome.tabs.sendMessage(tabId, ["previous", ""]);
});

$("#next").click(function() {
	chrome.tabs.sendMessage(tabId, ["next", ""]);
});