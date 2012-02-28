function destroyMessages(newMessagesIncoming) {
    var allMessages	= document.getElementById("allMessages")
	var messages	= document.getElementsByName("message");

	for each( var message in messages)
		allMessages.removeChild(message);
	
	if(newMessagesIncoming && document.getElementById("noMessages") != null) {
		allMessages.removeChild(document.getElementById("noMessages"));
	} else if (document.getElementById("noMessages") == null) {
		allMessages.appendChild(createHTMLElement(
			"div",{
				"id": "noMessages",
				"class": "messageBox"
			},[
				document.createTextNode("No new messages.")
			]));
	}
}

function createMessage(message) {

	if(message.type == "offer")
		var text = " has offered:";
	else
		var text = " has replied:";

	//Display the box
	document.getElementById("allMessages").appendChild(createHTMLElement("div",{
			"name": "message",
			"class": "messageBox"
		},[
			createHTMLElement("div",{
				"class": "messageTitle"
			},[
				createHTMLElement("a",{
					"href": message.traderProfile,
					"target": "_blank"
				},[
					document.createTextNode(message.traderName)
				]),
				document.createTextNode(text)
			]),
			createHTMLElement("a",{
				"href": message.messageLink,
				"target": "_blank"
			},[
				document.createTextNode(message.messageText)
			])
		]));
}

function loggedIn() {
	document.getElementById("navLoggedIn").style.display = "block";
	document.getElementById("navLoggedOut").style.display = "none";
}

function loggedOut() {
	document.getElementById("navLoggedIn").style.display = "none";
	document.getElementById("navLoggedOut").style.display = "block";
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

self.port.on("loggedIn",loggedIn);
self.port.on("loggedOut",loggedOut);
self.port.on("createMessage",createMessage)
self.port.on("destroyMessages",destroyMessages)