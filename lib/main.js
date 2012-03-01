// Require modules.
var Data			= require("self").data;
var Tabs			= require("tabs");
var Request			= require("request");
var Timer			= require("timers");
var Notifications	= require("notifications");
var Preferences		= require("simple-prefs").prefs;

//Constants
const ICON_NOLOGON		= Data.url("notloggedin.png");
const ICON_NOMESSAGES	= Data.url("nomessages.png");
const ICON_NEWMESSAGES	= Data.url("newmessages.png");
const ICON_ERROR		= Data.url("error.png");
const ICON_LOADING		= Data.url("loading.png");

const URL_DOMAIN	= "http://www.tf2outpost.com";
const URL_API		= URL_DOMAIN + "/api/notifications";
//const URL_API		= "http://pastebin.com/raw.php?i=h7mb4506";
const URL_USER		= URL_DOMAIN + "/user/";
const URL_TRADE		= URL_DOMAIN + "/trade/";
const URL_TRADES	= URL_DOMAIN + "/trades";

const PAGE_MESSAGES		= Data.url("messages.html");
const PAGE_NOTIFIER		= Data.url("notifier.js");
const PAGE_NOTIFIERCSS	= Data.url("notifier.css");
const PAGE_MESSAGELIB	= Data.url("messages.js");

//Preferences
//Update every x minutes.
var getUpdate				= Preferences.updateRate;
//Display the notification in seconds.
var notificationTime		= Preferences.notificationTime;
//Show all	notifications?
var showAllNotifications	= Preferences.showAllNotifications;
//Just one notification when new messages arrived.
var showJustOneNotification = Preferences.showJustOneNotification;


//globals
var panel;
var widget;
var latestMessage = 0;

exports.main = function() {

	panel = require("panel").Panel({
				contentURL: PAGE_MESSAGES,
				contentScriptFile: PAGE_MESSAGELIB,
				contentScript: 
					"self.port.on('loggedInState',loggedInState);" +
					"self.port.on('addonMessage',addonMessage);" +
					"self.port.on('createMessage',createMessage);" +
					"self.port.on('removeMessage',removeMessage);" +
					"self.port.on('destroyMessages',destroyMessages);",
				width: 400
			});
	panel.port.on("Update",update);

	widget = require("widget").Widget({
				id: "tf2opalert-widget",
				width: 136,
				contentURL: ICON_LOADING,
				panel: panel,
				tooltip: "Loading...",
				label: "TF2OP Alert!",
			});

	update();
	Timer.setInterval(update,getUpdate*60000);	
};

function update() {	
	Request.Request({
		url: URL_API,
		onComplete:
			//Here are all the incoming messages parsed..
			function (Response) {
				panel.port.emit("destroyMessages");
				var apiData = Response.json;
				if(apiData) {
					//Check for errors.
					if(apiData['error']) {
						//Update panel for users that are not logged in.
						panel.port.emit("loggedInState",false);
						if(apiData.error == 500) {
							//Not logged in.
							widget.contentURL	= ICON_NOLOGON;
							widget.tooltip		= "You have to log in to view your messages.";
							panel.port.emit("addonMessage","Please log in to view your messages.");
						} else {
							//Some other error occurred.
							widget.contentURL	= ICON_ERROR;
							widget.tooltip		= "Please notify me if the problem persists!";
							panel.port.emit("addonMessage","An unknown error occurred! Error code: " + messages.error + " " + messages.message);
						}
					} else {
						//Update panel for users that are logged in.
						panel.port.emit("loggedInState",true);
						
						if(isEmpty(apiData.offers) && isEmpty(apiData.replies)) {
							//No messages. 
							panel.port.emit("addonMessage","No new messages.");
							widget.contentURL	= ICON_NOMESSAGES;
							widget.tooltip		= "Logged in as " + apiData.user.nickname + ".";
						} else {
							//Unread messages!
							var newMessages = false;															//For messages that we haven't notified the user about.		
							var latestOffer = latestMessage;
							
							if(showAllNotifications) {															//Add notifier.js to the current tab.
								var worker =	Tabs.activeTab.attach({
													contentScriptFile:	PAGE_NOTIFIER,
													contentScript:		"self.port.on('createNotification',createNotification);"
												});
								worker.port.on('removeMessage',function(messageId) {panel.port.emit("removeMessage",messageId);});
							}
							
							for each (var offer in apiData.offers) {
								for each(var post in offer.posts) {												//Step through all posts in all offers.
									var message =	{															//Create a new JSON object to pass onto the panel and notifications.
														id:				post.postid,
														type:			"offer",
														traderProfile:	URL_USER + post.user.id,
														traderName:		post.user.nickname,
														messageLink:	URL_TRADE + offer.id + "#p" + post.postid,
														messageText:	post.comment
													};

									panel.port.emit("createMessage",message);									//Write to the panel.
									if(post.posted > latestOffer ) {
										newMessages = true;
										latestOffer = post.posted;
										if(showAllNotifications)
											worker.port.emit("createNotification", message, notificationTime);	//Show notification.
									}
								}
							}
							
							for each (var reply in apiData.replies) {											//Step through all posts in all replies.
								for each(var post in reply.posts) {
									var message =	{
														id:				post.replyid,
														type:			"reply",
														traderProfile:	URL_USER + post.user.id,
														traderName:		post.user.nickname,
														messageLink:	URL_TRADE + reply.id + "#p" + post.replyid,
														messageText:	post.comment
													};
								
									panel.port.emit("createMessage",message);
									if(post.posted > latestMessage) {
										newMessages = true;
										latestMessage = post.posted;
										if(showAllNotifications)
											worker.port.emit("createNotification",message, notificationTime);
									}
								}
							}
							
							if(latestOffer > latestMessage)
								latestMessage = latestOffer;
							
							if(showJustOneNotification && newMessages) {										//Tell the user they have new messages in only one notification.
								Notifications.notify(	{
															title: "New messages on TF2Outpost!",
															text: "Go to my trades.",
															data: URL_TRADES,
															onClick: Tabs.open
														});
							}

							if(showAllNotifications)															//Don't forget to clean-up.
								Timer.setTimeout(worker.destroy,notificationTime*1000+1000);
							
							widget.contentURL	= ICON_NEWMESSAGES;
							widget.tooltip		= "Click to see messages.";
							
						}
					}
				//Response could not be JSON-serialized or no response at all.
				} else {
					panel.port.emit("loggedInState",false);
					panel.port.emit("addonMessage","An unknown error occured. It's probably a connection problem.");
					widget.contentURL	= ICON_ERROR;
					widget.tooltip		= "Please notify me if the problem persists!";
				}
			}
	}).get();
}

function isEmpty(messages) {
	for(var reply in messages) {
		if(messages.hasOwnProperty(reply))
			return false;
	}
	return true;
}
