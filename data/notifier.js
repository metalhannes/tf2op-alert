function createNotification(message, notificationTime) {
    //Set up first
	if(document.getElementById("notificationContainer") == null) {
		//Create container-div
		var notificationContainer = document.createElement("div");
		notificationContainer.setAttribute("id","notificationContainer");
		notificationContainer.setAttribute("style","position: fixed;bottom: 10px;right: 10px;width: 350px;z-index:100;");
		document.getElementsByTagName("body")[0].appendChild(notificationContainer);
	}
	
	//Set up the text
	if(message.type == "offer")
		var text = " has offered:";
	else
		var text = " has replied:";
		
	var notification	=	createHTMLElement("div",{
								"style": "background: #3b342f;border: 6px solid #3b342f;border-radius: 6px;-moz-border-radius: 6px;-webkit-border-radius: 6px;color: #695f57;padding: 8px;font-family: \"Helvetica Neue\", Helvetica, Arial, Geneva, sans-serif;font-size: 10px;margin: 0 0 10px 0;-webkit-font-smoothing: antialiased;opacity: 0;position: relative;right: 10px;bottom: 10px;z-index:101;width: 350px;padding: 10px 5px;display: none;"
							},[
								createHTMLElement("div",{
									"style": ""
								},[
									createHTMLElement("a",{
										"href": message.traderProfile,
										"style": "font-weight: bold;color: #FFFFFF;text-decoration: none;",
										"target": "_blank"
									},[
										document.createTextNode(message.traderName)
									]),
									document.createTextNode(text)
								]),
								createHTMLElement("a",{
									"href": message.messageLink,
									"style": "color: #FFFFFF;text-decoration: none;",
									"target": "_blank"
								},[
									document.createTextNode(message.messageText)
								])
							]);
					
	//Display it
	displayNotification(notification, notificationTime);
}

function displayNotification(notification, notificationTime) {
	document.getElementById("notificationContainer").appendChild(notification);
	notification.style.display = "block";
	fadeIn(notification, 0.05, notificationTime);
}
	
function fadeIn(notification, opacity, notificationTime) {
	notification.style.opacity = opacity;
	if(opacity < 0.9)
		window.setTimeout(function() { fadeIn(notification, opacity + 0.05, notificationTime);},50);
	else
		window.setTimeout(function() { fadeOut(notification,opacity); }, notificationTime*1000);
}

function fadeOut(notification,opacity) {
	notification.style.opacity = opacity;
	if(opacity > 0)
		window.setTimeout(function() { fadeOut(notification,opacity - 0.05); },50);
	else
		document.getElementById("notificationContainer").removeChild(notification);
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

self.port.on("createNotification",createNotification)