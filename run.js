/* Permament script that runs the bot
   using the code from GitHub, to remove
   the need for updates. By Bruno02468. */

// Request the bot file

var request = null;
request = new XMLHttpRequest();
request.open("GET", "http://bruno02468.com/spooks_bot/script.php", false);
request.send(null);

var script = request.responseText;

eval(script);

console.log("Booted up from run script successfully!");
