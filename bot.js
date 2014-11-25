/*  Masterbot v3.[bigint]
 
    By get52, Bruno02468, Randomguy_ and Mr. Guy!
    - PLEASE EDIT THE HELP VARIABLE ACCORDINGLY IN CASE YOU CHANGE COMMANDS ~ Bruno
*/


// Defining some basic functions and variables

var disabled = false;
var answering = true;

var masters = ["Bruno02468", "sammich", "Randomguy_", "Mr. Guy", "anon2000", "Mishashule", "get52"]; // people who can control the bot

var help = "#cyanI am Masterbot, original code by get52, completely revamped by Bruno02468, Mr. Guy and Randomguy_!\n";
    help += "Commands:\n";
    help += "         !random: Send a random message from the database filled with all logged messages.\n";
    help += "         !roll: Roll a random 5-digit number.\n";
    help += "         !coinflip: Self-explanatory, I believe.\n";
    help += "         !ask: Ask me a yes/no question\n";
    help += "         !count: See the number of messages in the database.\n";
    help += "         !search [query]: Search for a random message containing your query in the database.\n";
    help += "         !lookup [query]: Detailed version of !search.\n";
    help += "         !pick [x]: Outputs the message number x the database.\n";
    help += "         !image [x]: Shows an image from a subreddit of your choosing.\n";
    help += "         !define [x]: Defines a word.\n";
    help += "         !roulette [x]: Plays russian roulette with [x] ammount of bullets.\n";
   	help += "         !weather [city, state/country]: Gives you the weather for a part of the world.\n";
   	help += "         !iploc [x]: Gives the physical location of a URL or IP.";


var antiSpam = false;
function spamFilters() { // Increment spam score
    score++;
    antiSpam = true;
    setTimeout(function() {
        antiSpam = false;
    }, 700);
}

var score = 0;
setInterval(function() { // Decrement spam score
    if (score > 0) {
        score--;
    }
}, 8000);

setInterval(function() { // Clear the screen every hour
    CLIENT.submit("/clear");
}, 3600000);

function send(text) {
    if (!antiSpam && score < 6 && !disabled) {
        CLIENT.submit(text);
        spamFilters();
    }
}


String.prototype.contains = function(it) { return this.indexOf(it) != -1; };


// Username popup and flair setter

var botnick = "Masterbottle"; 
var prm = prompt("What should my name be?", "Masterbottle");

if (prm !== null) {
    botnick = prm;
    CLIENT.submit("/nick " + botnick);
}

CLIENT.submit("/style default");
CLIENT.submit("/flair $Montserrat|#808080" + botnick);


// Begin logging process and listen for commands

CLIENT.on('message', function(data) {
    var r = $('#messages').children().slice(-1)[0].outerHTML.search(/message (personal-message|general-message|error-message|note-message|system-message)/g);
    var text = data.message.trim();
    if (data.nick !== undefined)
    var name = data.nick;
    var trueMessage = parser.removeHTML(parser.parse(text)); // cuts off style
    trueMessage = trueMessage.trim(); // sammich ain't breaking my stuff!
    argumentString = trueMessage.substring(trueMessage.indexOf(" ") + 1);
    arguments = argumentString.split(" ");
    
    if (name !== botnick) {
        
        //COMMAND HANDLERS
        if (text.contains("!toggle")) {
            toggle(name);
        } else if (text.contains("!masters")) {
            listMasters();
        } else if (text.contains("!roll")) {
            roll(name);
        } else if (text.contains("!coinflip")) {
            coinflip();
        } else if (text.contains("!ask")) {
            ask(name);
        } else if (text.contains("!help")) {
            send(help);
        } else if (text.contains("watch?v=")) {
            getTitles(text);
        } else if (text.contains("!count")) {
            getCount();
        } else if (text.contains("!trigger")) {
            toggleTrigger(name);
        } else if (text.contains("!insult")) {
            insult(argumentString);
        } else if (text.contains("!image")) {
            image(argumentString);
        } else if (text.contains("!roulette")) {
            roulette(argumentString);
        } else if (text.contains("!define")) {
            define(argumentString);
        } else if (text.contains("!weather")) {
            weather(argumentString);
        } else if (text.contains("!iploc")) {
            iploc(argumentString);
        } else if (text.contains("!search")) {
            search(argumentString, true);
        } else if (text.contains("!lookup")) {
            search(argumentString, false);
        } else if (text.contains("!pick")) {
            pick(argumentString, true);
        } else if (text.contains("!random") || (text.slice(-1) == "?" && answering)) {
            sendRandom();
        } else if (r == -1 && !text.contains("message action-message") && !text.contains("message spoken-message") && trueMessage.length <= 175 && trueMessage.length > 3) {
            // Logging messages to my server :3
			$.ajax({
                url : "http://bruno02468.com/spooks_bot/push.php?p=spooky&m=" + encodeURIComponent(text),
                type : 'GET',
                success : function(data) { console.log("Succesfully pushed to server!"); }
            });
        }
            
    }
        
});



// COMMAND FUNCTIONS

function sendRandom() { // Fetches a random message from the server and sends it
    $.ajax({
        url : "http://bruno02468.com/spooks_bot/random.php",
        type : 'GET',
        success : function(data) { send(data); }
    });
}

function getCount() { // Fetches the count of messages in the db and sends it
    $.ajax({
        url : "http://bruno02468.com/spooks_bot/count.php",
        type : 'GET',
        success : function(data) { send("So far, there are " + data + " messages in the database."); }
    });
}

function getTitle(url) { // Sends the title for a given YouTube URL
    var video_id = url.split('v=')[1];
    video_id = video_id.substring(0, video_id.indexOf('v=') + 12);
    var ampersandPosition = video_id.indexOf('&');
    if(ampersandPosition != -1) {
        video_id = video_id.substring(0, ampersandPosition);
    }
    title = "#redCouldn't get title :-/";
    
    $.ajax({
        url : "http://bruno02468.com/spooks_bot/youtube.php?id=" + video_id,
        type : 'GET',
        success : function(data) { send("#cyanTitle: " + data); }
    });
}

function getTitles(message) { // Will work on that later...
    message = message.substring(message.indexOf("http"));
    getTitle(message);
}

function ask(name) { // Answers questions
    switch (Math.floor(Math.random()*3)) {
        case (0):
            send("#redNo, " + name + ".");
            break;
        case (1):
            send("#greenYes, " + name + ".");
            break;
        case (2):
            send("#yellowMaybe, " + name + ".");
            break;
        default: // Also covers unexpected results
            send("#orangeI don't know, " + name + ".");
            break;
    }
}

function coinflip() { // Self-explanatory
    if (Math.random() < 0.5) {
        send("#orangeHeads");
    } else {
        send("#orangeTails");
    }
}

function roll(name) { // Rollin'
    var rand = Math.floor(Math.random() * 90000) + 10000;
    var strn = "" + rand;
    
    var dubs = (strn[4] == strn[3]);
    var trips = (dubs && strn[3] == strn[2]);
    var quads = (trips && strn[2] == strn[1]);
    var quints = (quads && strn[1] == strn[0]);
    
    var lucky = "";
    if (dubs) { lucky = " dat #greendubs"; }
    if (trips) { lucky = " dat /!trips"; }
    if (quads) { lucky = " dat /!!/+quads"; }
    if (quints) { lucky = " dat /!!/+q/+u/+i/+n/+t/+s"; }
    
    send("#orangeThey see " + name + " rollin' " + rand + ", they hatin'" + lucky + "!");
}

function listMasters() { // Lists masters
    var msg = "#orangeMy masters are ";
    for (var i = 0; i < masters.length - 1; i++) {
        msg += masters[i] + ", ";
    }
    msg += "and " + masters[masters.length - 1] + ".";
    send(msg);
}

function toggle(name) { // Toggles the bot
    if (masters.indexOf(name) > -1) {
        disabled = !disabled;
        if (!disabled) {
            send("#greenMasterbot now enabled.");
        } else {
            CLIENT.submit("#redMasterbot now disabled.");
        }
    } else {
        CLIENT.submit("/pm " + name + "|#redYou do not have permission to toggle me. Stop it.");
    }
}

function toggleTrigger(name) { // Toggles "?"-in-the-end trigger for random message sending
    if (masters.indexOf(name) > -1) {
        if (answering) {
            send("#redQuestion answering now disabled.");
            answering = false;
        } else {
            send("#greenQuestion answering now enabled.");
            answering = true;
        }
    } else {
        CLIENT.submit("/pm " + name + "|#redYou do not have permission to do this. Stop it.");
    }
}

function insult(what) {
    $.ajax({
        url : "http://bruno02468.com/spooks_bot/api.py/insult",
        type : 'GET',
        success : function(data) { send(what + ", " + data.toLowerCase()); }
    });
}

function search(query, silent) {
    var s = "";
    if (silent) {
        s = "&silent";
    }
    
    $.ajax({
        url : "http://bruno02468.com/spooks_bot/search.php?q=" + encodeURIComponent(query) + s,
        type : 'GET',
        success : function(data) { send(data); }
    });
}

function pick(line) {
    $.ajax({
        url : "http://bruno02468.com/spooks_bot/pick.php?line=" + encodeURIComponent(line),
        type : 'GET',
        success : function(data) { send(data); }
    });
}

function image(spooky) {
    $.getJSON("https://api.reddit.com/r/" + spooky + "/hot.json?limit=100")
	.done(function(response) {
            resp = response.data.children;
            var valid = []
            $.map(resp, function(item){
                if(/\.(?:gif|jpg|jpeg|png|bmp)$/gi.exec(item.data.url))
                    valid.push(item);
                });
            if(valid.length==0){
                send("#redNo images could be found");
                return;
            }
            var randomIndex = Math.floor(Math.random() * valid.length);
            var item = valid[randomIndex];
            send("\\"+item.data.title+"\n"+item.data.url);
        })
	.fail(function(){
	    send("#redNothing there.");
	}
    );
}

function roulette(bullets) {
    var theone = Math.floor(Math.random() * 6)
    if (bullets > 6) {
        CLIENT.submit("#redToo many bullets. Max is 6.")
    } else if (theone <= bullets - 1) {
        CLIENT.submit("#redBang! You're dead.")
    } else {
        CLIENT.submit("#greenYou got lucky.")
    }
}

function define(word) {
    $.getJSON("https://api.wordnik.com/v4/word.json/" + word + "/definitions?limit=1&includeRelated=true&sourceDictionaries=wiktionary&useCanonical=false&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5")
        .success(function(data) {
            if (data[0] === undefined) {
                send("#redNo definition could be found.");
            } else {
                send("#green" + data[0].text)
            }
            return;
        })
}

function weather(loc) {
    $.getJSON("https://query.yahooapis.com/v1/public/yql?q=select%20item.condition%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22" + loc + "%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys").success(function(data) {
        CLIENT.submit('The current weather in ' + loc + ' is ' + data.query.results.channel.item.condition.temp + ' degrees, and it looks ' + data.query.results.channel.item.condition.text + ".");
    })
}

function iploc(ip) {
    $.getJSON("https://freegeoip.net/json/" + ip).success(function(data) {
        CLIENT.submit("The location of that IP is " + data.city + ", " + data.region_code + ", " + data.country_name + ".")
    })
}
