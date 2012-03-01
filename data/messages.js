function createMessage(message) {

	if(message.type == "offer")
		var text = " has offered:";
	else
		var text = " has replied:";

	//Display the box
	document.getElementById("allMessages").appendChild(
		createHTMLElement("div",{
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
				"href":		message.messageLink,
				"onclick":	"removeMessage('" + message.id  + "');",
				"target":	"_blank"
			},[
				document.createTextNode(message.messageText)
			])
		]));
}

function destroyMessages() {
    var allMessages	= document.getElementById("allMessages");
	for each( var message in allMessages.childNodes)
		allMessages.removeChild(message);
}

function addonMessage(message) {
	var allMessages		= document.getElementById("allMessages");
	var addonMessage	= document.getElementById("addonMessage");
	if(addonMessage)
		allmessages.removeChild(addonMessage);
	allMessages.appendChild(createHTMLElement(
		"div",{
			"id": "addonMessage",
			"class": "messageBox"
		},[
			document.createTextNode(message)
		]));
}

function removeMessage(messageId) {
    var allMessages	= document.getElementById("allMessages");
	allMessages.removeChild(document.getElementById(messageId));
	if(document.getElementsByName("message").length < 1)
		addonMessage("No new messages.");
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

function createHTMLElement(tag, attributes, childNodes) {
	var element = document.createElement(tag);
	
	if(attributes != undefined) {
		for( var attribute in attributes) {
			if(attributes.hasOwnProperty(attribute))
				element.setAttribute(attribute,attributes[attribute]);
		}
	}
	
	if(childNodes != undefined) {
		for(var node in childNodes) {
			element.appendChild(childNodes[node]);
		}
	}
	
	return element;
}

document.getElementsByName("updateLink")[0].onclick = function() {self.port.emit("Update");}
document.getElementsByName("updateLink")[1].onclick = function() {self.port.emit("Update");}