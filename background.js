chrome.browserAction.onClicked.addListener(function(tab) {
	console.log("Highlighting synonyms on page: " + tab.url);
	chrome.tabs.executeScript(null, {file:"jquery.js"});
	chrome.tabs.executeScript(null, {file:"highlight.js"});
	chrome.tabs.executeScript(null, {file: "synonymhighlight.js"});
});