var messages			= [];
var addonMessage;

function displayMessage(message) {

	var allMessages = document.getElementById("allMessages");

	if(message.type == "offer")
		var text = " has offered:";
	else
		var text = " has replied:";

	//Not enough messages, create a new one.
	if(messages.length == 0) {
		var messageBox =	createHTMLElement("div",{
			"name":		"message",
			"class":	"messageBox",
			"id":		message.id
		},[
			createHTMLElement("div",{
				"class": "messageTitle"
			},[
				createHTMLElement("a",{
					"href":		message.traderProfile,
					"target":	"_blank"
				},[
					document.createTextNode(message.traderName)
				]),
				document.createTextNode(text)
			]),
			createHTMLElement("a",{
				"href":		"about:blank", //message.messageLink,
				"target":	"_blank"
			},[
				document.createTextNode(message.messageText)
			])
		]);
		messageBox.childNodes[1].onclick = function(){removeMessage(this.parentNode.id);};
		allMessages.appendChild(messageBox);
	} else {
		var messageBox = messages.pop();
		messageBox.id = message.id;
		messageBox.childNodes[0].childNodes[0].href	= message.traderProfile;
		messageBox.childNodes[0].childNodes[0].childNodes[0].nodeValue = message.traderName;
		messageBox.childNodes[0].childNodes[1].nodeValue = text;
		messageBox.childNodes[1].href = message.messageLink;
		messageBox.childNodes[1].childNodes[0].nodeValue = message.messageText;
		allMessages.appendChild(messageBox);
	}

	//Resize Panel
	resize();
}

function removeAllMessages() {
	var allMessages = document.getElementById("allMessages");
	if(document.getElementById("addonMessage")) {
		addonMessage = allMessages.removeChild(document.getElementById("addonMessage"));
	}

	while (allMessages.firstChild) 
		messages.push(allMessages.removeChild(allMessages.firstChild));
}

function newAddonMessage(message) {
	if(document.getElementById("addonMessage")) {
		document.getElementById("addonMessage").childNodes[0].nodeValue = message;
	} else {
		addonMessage.childNodes[0].nodeValue = message;
		document.getElementById("allMessages").appendChild(addonMessage);
	}
	resize();
}

function removeMessage(messageId) {
	messages.push(document.getElementById("allMessages").removeChild(document.getElementById(messageId)));
	if(document.getElementsByName("message").length < 1)
		newAddonMessage("No new messages.");
	resize();
}

function loggedInState(loggedIn) {
	if(loggedIn) {
		document.getElementById("navLoggedIn").style.display = "block";
		document.getElementById("navLoggedOut").style.display = "none";
	} else {
		document.getElementById("navLoggedIn").style.display = "none";
		document.getElementById("navLoggedOut").style.display = "block";
	}
}

function resize() {
	var allMessages	= document.getElementById("allMessages");

	if (allMessages.offsetWidth == 0)	//Panel isn't being displayed. So the height returned is wrong.
		return;
		
	var height = allMessages.offsetHeight + document.getElementById("navBar").offsetHeight;
	if(height > 600)
		height = 600;
	self.port.emit("resize",height + 28);
	
}

function createHTMLElement(tag, attributes, childNodes) {
	var element = document.createElement(tag);
	var i;
	
	for(i in attributes) {
		element.setAttribute(i,attributes[i]);
	}
	
	if(childNodes != undefined) {
		for(i in childNodes) {
			element.appendChild(childNodes[i]);
		}
	}
	
	return element;
}