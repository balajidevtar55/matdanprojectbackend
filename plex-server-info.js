var PlexAPI = require("plex-api");
var client = new PlexAPI("199.79.63.188");

client.query("/").then(function (result) {
	console.log("%s running Plex Media Server v%s",
		result.friendlyName,
		result.version);

	// array of children, such as Directory or Server items
	// will have the .uri-property attached
	console.log(result._children);
}, function (err) {
	console.error("Could not connect to serverssss", err);
});