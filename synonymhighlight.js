var scrollIndex = 0;
var scrollTime = 0;


function readFile() {
	var fileURL = chrome.extension.getURL("thesaurus.txt");
	var xmlreq = new XMLHttpRequest();
	xmlreq.open("GET", fileURL, false); //false makes it syncronous, we'll just wait till it's done
	xmlreq.send();
	//The file should be in xmlreq.responseText array
	return xmlreq.responseText.split("\n");
}

function updateIndexUI() {
	chrome.runtime.sendMessage({
		command: "IndexUI",
		currentIndex: scrollIndex,
		total: $(".highlight").length
	});
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
	$.scrollTo($(".highlight").get(scrollIndex), scrollTime, {offset: {top:-(($(window).height() / 2))}});
	$(".highlight").eq(scrollIndex).css({
		backgroundColor: "#FF8000"
	});
	updateIndexUI();
}

function scrollToNext() {
	$(".highlight").eq(scrollIndex).css({
		backgroundColor: "#FFFF88"
	});
	scrollIndex++;
	if(scrollIndex >= $(".highlight").length) {
		scrollIndex = 0;
	}
	$(".highlight").eq(scrollIndex).css({
		backgroundColor: "#FF8000"
	});
	$.scrollTo($(".highlight").get(scrollIndex), scrollTime, {offset: {top:-($(window).height() / 2)}});
	updateIndexUI();
}

function scrollToPrevious() {
	$(".highlight").eq(scrollIndex).css({
		backgroundColor: "#FFFF88"
	});
	scrollIndex--;
	if(scrollIndex < 0) {
		scrollIndex = $(".highlight").length - 1;
	}
	$(".highlight").eq(scrollIndex).css({
		backgroundColor: "#FF8000"
	});
	$.scrollTo($(".highlight").get(scrollIndex), scrollTime, {offset: {top:-($(window).height() / 2)}});
	updateIndexUI();
}

function dehighlight() {
	$("body").unhighlight();
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	switch(message[0]) {
		case "initialize":
			readFile();
			break;
		case "query":
			highlightQuery(message[1]);
			break;
		case "dehighlight":
			dehighlight();
			break;
		case "next":
			scrollToNext();
			break;
		case "previous":
			scrollToPrevious();
			break;
	}
});