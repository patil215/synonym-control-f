chrome.runtime.onConnect.addListener(function(port) {
    port.onDisconnect.addListener(function(event) {
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
                sendMessage("dehighlight", "");
            });
        });
    });
});

function sendMessage(name, details) {
    chrome.tabs.sendMessage(tabId, [name, details]);
}