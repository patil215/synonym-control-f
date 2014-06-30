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
            file: "highlight.min.js"
        });
        chrome.tabs.executeScript(tabId, {
            file: "jquery.scrollTo.min.js"
        });
        chrome.tabs.executeScript(tabId, {
            file: 'synonymhighlight.js'
        }, function() {
        	sendMessage("initialize", "");
        });
    });
});
chrome.runtime.onMessage.addListener(function(message, sender) {
    switch (message.command) {
        case "IndexUI":
            if (message.total == 0) {
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
$("#query").keyup(function(e) {
    // If shift key held down, go previous
    if (e.keyCode == 13) {
        if (e.shiftKey) {
        	sendMessage("previous", "");
        } else {
            // If it's the same query, go to the next result, otherwise, do a new search
            if ($("#query").val() == lastQueryInput) {
            	sendMessage("next", "");
            } else {
                search();
            }
        }
    }
});

function sendMessage(name, details) {
	chrome.tabs.sendMessage(tabId, [name, details]);
}

function search() {
    console.log("Highlighting synonyms on page: ");
    query = $("#query").val();
    lastQueryInput = query;
    sendMessage("dehighlight", "");
    sendMessage("query", query);
}
$("#submit").click(function() {
    search();
});
$("#dehighlight").click(function() {
    $("#indexText").text("0 of 0");
    $("#query").val("");
    $("#query").focus();
    sendMessage("dehighlight", "");
});
$("#previous").click(function() {
	sendMessage("previous", "");
});
$("#next").click(function() {
	sendMessage("next", "");
});