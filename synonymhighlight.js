function readFile() {
	var fileURL = chrome.extension.getURL("thesaurus.txt");
	var xmlreq = new XMLHttpRequest();
	xmlreq.open("GET", fileURL, false); //false makes it syncronous, we'll just wait till it's done
	xmlreq.send();
	//The file should be in xmlreq.responseText array
	return xmlreq.responseText.split("\n");
}

function highlightQuery(query) {
	var lineArray = readFile();
	var synonyms = [];
	var index = 1;
	while(index < lineArray.length) {
		var line = lineArray[index];
		var lineWords = line.split("|");
		var numDefs = parseInt(lineWords[1]);
		if(lineWords[0] == query) {
			for(var d = index + 1; d < index + numDefs; d++) {
				var synonymLine = lineArray[d];
				var synonymWords = synonymLine.split("|");
				for(var k = 1; k < synonymWords.length; k++) {
					synonyms.push(synonymWords[k]);
				}
			}
			break;
		} else {
			index += (1 + numDefs);
		}
	}
	$("body").highlight(query);
	$("body").highlight(synonyms);
	$(".highlight").css({
		backgroundColor: "#FFFF88"
	});
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	if(message[0] == "initialize") {
		readFile();
	} else if (message[0] == "query") {
		highlightQuery(message[1]);
	}
});