function createNotification(message, notificationTime) {
    //Set up first
	if(document.getElementById("tf2op-alert-notificationContainer") == null) {
		//Add CSS Rules
		document.getElementsByTagName("head")[0].appendChild(
			createHTMLElement("style", {
				"type":		"text/css",
				"rel":		"stylesheet",
				"media":	"screen",
				"title":	"dynamicSheet"
			}));
		var css = document.styleSheets[document.styleSheets.length - 1];
		css.insertRule("#tf2op-alert-notificationContainer { "+
			"position: fixed;" +
			"bottom: 10px;" +
			"right: 10px;" +
			"width: 350px;" +
			"z-index:100;}",0);
		css.insertRule(".tf2op-alert-notification {" + 
			"background: #3B342F;" +
			"border: 6px solid #3B342F;" +
			"border-radius: 6px;" +
			"color: #695F57;" +
			"padding: 8px;" +
			"font-family: \"Helvetica Neue\", Helvetica, Arial;" +
			"font-size: 10px;" +
			"margin: 0 0 10px 0;" +
			"opacity: 0;" +
			"position: relative;" +
			"right: 20px;" +
			"bottom: 0px;" +
			"z-index:101;" +
			"width: 350px;" +
			"padding: 10px 5px;" +
			"display: none;}",1);
		css.insertRule(".tf2op-alert-notification-title , .tf2op-alert-notification-title a {" + 
			"font-size: 12px;" + 
			"font-weight:bold;}",2);
		css.insertRule(".tf2op-alert-notification a {" +
			"color: #FFFFFF;" +
			"text-decoration: none;}",3);
		css.insertRule(".tf2op-alert-notification a:hover { color: #CCCCCC}",3);
		
		//Create container-div
		document.getElementsByTagName("body")[0].appendChild(createHTMLElement("div", {"id": "tf2op-alert-notificationContainer",}));

	}
	
	//Set up the text
	if(message.type == "offer")
		var text = " has offered:";
	else
		var text = " has replied:";
	
	//Create the notification
	var notification	=	createHTMLElement("div", {								//Main div for notification.
								"class":	"tf2op-alert-notification"
							},[
								createHTMLElement("div", {							//Set the title.
									"class":	"tf2op-alert-notification-title"
								},[
									createHTMLElement("a", {						//Link to the traders profile.
										"href":		message.traderProfile,
										"target":	"_blank"
									},[
										document.createTextNode(message.traderName)	//The traders name.
									]),
									document.createTextNode(text),					//"has offered" or "has replied"
								]),
								createHTMLElement("a", {							//Link to the post on tf2op.
										"href":		message.messageLink,
										"target":	"_blank"
									},[
										document.createTextNode(message.messageText)//The message itself.
									])
							]);
		
	//Append to the document.
	document.getElementById("tf2op-alert-notificationContainer").appendChild(notification);
	//Make clicking the message remove it from the panel.
	notification.childNodes[1].onclick = function(){ self.port.emit("removeMessage",message.id); };
	//Display it.
	notification.style.display = "block";
	fadeIn(notification, 0.05);
	//Remove it.
	window.setTimeout(function() { fadeOut(notification,0.85); }, notificationTime*1000);
	
}

function fadeIn(notification, opacity) {
	notification.style.opacity = opacity;
	if(opacity < 0.9)
		window.setTimeout(function() { fadeIn(notification, opacity + 0.05);},50);
}

function fadeOut(notification,opacity) {
	notification.style.opacity = opacity;
	if(opacity > 0)
		window.setTimeout(function() { fadeOut(notification,opacity - 0.05); },50);
	else
		document.getElementById("tf2op-alert-notificationContainer").removeChild(notification);
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
