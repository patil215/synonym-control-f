window.onload = function() {
  document.getElementById("query").focus();
};

$("#query").keyup(function (e) {
    if (e.keyCode == 13) {
        search();
    }
});

function search() {
	console.log("Highlighting synonyms on page: ");
	query = $("#query").val();

	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.executeScript(tab.id, {
			file: "jquery.js"
		});
		chrome.tabs.executeScript(tab.id, {
			file: "highlight.js"
		});

		chrome.tabs.executeScript(tab.id, {
			file: 'synonymhighlight.js'
		}, function() {
			chrome.tabs.sendMessage(tab.id, query);
		});
	});

}
document.getElementById('submit').addEventListener('click', search);