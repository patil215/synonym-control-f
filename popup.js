function hello() {
	console.log("Highlighting synonyms on page: ");
	chrome.tabs.executeScript(null, {file:"jquery.js"});
	chrome.tabs.executeScript(null, {file:"highlight.js"});
	chrome.tabs.executeScript(null, {file: "synonymhighlight.js"});
}
document.getElementById('submit').addEventListener('click', hello);