/*  Masterbot v5.[bigint]
 
    By get52, Bruno02468, Randomguy_ and Mr. Guy!
    - PLEASE EDIT THE HELP VARIABLE ACCORDINGLY IN CASE YOU CHANGE COMMANDS ~ Bruno
*/


// Defining some basic functions and variables

var disabled = false;
var answering = false;

// People who can control the bot
var masters = ["Bruno02468", "sammich", "Randomguy_", "Mr. Guy", "InfraRaven", "Kevin", "L̫̪̯̠͠A̜̭̘͚M̧̮͙͇̭̫P̷̘"]; 

var help = "#cyanI am Masterbot, original code by get52, completely revamped by Bruno02468, Mr. Guy and Randomguy_!\n";
    help += "Commands:\n";
    help += "         !help: Get some help when using the bot!\n";
    help += "         !random: Send a random message from the database filled with all logged messages.\n";
    help += "         !count: See the number of messages in the database.\n";
    help += "         !pick [n]: Outputs the message number n the database.\n";
    help += "         !checkem: Roll a random 5-digit number.\n";
    help += "         !coinflip: Self-explanatory, I believe.\n";
    help += "         !ask: Ask me a yes/no question\n";
    help += "         !image [subreddit]: Shows an image from a subreddit of your choosing.\n";
    help += "         !quote [subreddit]: Returns a quote from the selected subreddit.\n";
    help += "         !define [word]: Defines a word.\n";
    help += "         !roulette [n]: Plays russian roulette with n bullets.\n";
    help += "         !weather [city, state/country]: Gives you the weather for a part of the world.\n";
    help += "         !til: Gives a random fact someone learned. Learn something new!\n";
    help += "         !iploc [ip]: Gives the physical location of a URL or IP.\n";
    help += "         !get msg: Retrieves the current /msg.\n";

// Anti-spam variables
var antiSpam = false;
var score = 0;

// Increment spam score
function spamFilters() {
    score++;
    antiSpam = true;
    setTimeout(function() {
        antiSpam = false;
    }, 700);
}


// Decrement spam score
setInterval(function() {
    if (score > 0) {
        score--;
    }
}, 8000);

// Clear the screen every hour
setInterval(function() {
    CLIENT.submit("/clear");
}, 3600000);

// Send and trigger anti-spam
function send(text) {
    if (!antiSpam && score < 7 && !disabled) {
        CLIENT.submit(text);
        spamFilters();
    }
}

// Escaping strings
function escapeForSending(string) {
    var pat = /\/(?:.)/gi;
    return string.replace(pat, "\\/");
}


// Case insensitive string lookup function
String.prototype.contains = function(it) { return this.toLowerCase().indexOf(it.toLowerCase()) != -1; };


// Username popup and flair setter
var botnick = "Masterbottle"; 
var prm = prompt("What should my name be?", botnick);
if (prm !== null) {
    botnick = prm;
    CLIENT.submit("/nick " + botnick);
}
CLIENT.submit("/style default");
CLIENT.submit("/flair $Montserrat|#808080" + botnick);
CLIENT.submit("/safe");
CLIENT.submit("/echo #greenMasterbot now running.");

// Mouse bot -- possibly future-proofing AFK detection?
var one_start = 500;
var cursor = true;
setInterval(function () {
    if (cursor) {
        one_start++;
        var x = (Math.sin(one_start * .05) * .3 + 0.5);
        y = (Math.cos(one_start * .05) * .3 + 0.5);
        CLIENT.updateMousePosition(position = {
            x: x,
            y: y
        });
    }
}, 50);


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
        } else if (text.contains("!checkem")) {
            roll(name);
        } else if (text.contains("!coinflip")) {
            coinflip();
        } else if (text.contains("!ask")) {
            ask(name);
        } else if (text.contains("!help")) {
            CLIENT.submit("/pm " + name + "|" + help);
        } else if (text.contains("!shouthelp")) {
            send(help);
        } else if (text.contains("watch?v=")) {
            getTitles(text);
        } else if (text.contains("!count")) {
            getCount();
        } else if (text.contains("!til")) {
            til();
        } else if (text.contains("!get msg")) {
            getMsg();
        } else if (text.contains("!trigger")) {
            toggleTrigger(name);
        } else if (text.contains("!image")) {
            image(argumentString);
        } else if (text.contains("!roulette")) {
            roulette(argumentString);
        } else if (text.contains("!define")) {
            define(argumentString);
        } else if (text.contains("!weather")) {
            weather(argumentString);
        } else if (text.contains("!quote")) {
            quote(argumentString);
        } else if (text.contains("!iploc")) {
            iploc(argumentString);
        } else if (text.contains("!cursor")) {
            toggleCursor(name);
        } else if (text.contains("!pick")) {
            pick(argumentString, true);
        } else if (text.contains("!stream")) {
            send("#cyanSpooks Radio Stream: http://216.170.123.121:8000/listen.pls?sid=1");
        } else if (text.contains("!random") || (text.slice(-1) == "?" && answering)) {
            sendRandom();
        } else if (r == -1 && !text.contains("message action-message") && !text.contains("message spoken-message") && trueMessage.length <= 175 && trueMessage.length > 3) {
            // Logging messages to my server :3
            $.ajax({
                url : "http://bruno02468.com/masterbot/api.php?action=log&msg=" + encodeURIComponent(text),
                type : 'GET',
                success : function(data) { console.log("Succesfully pushed to server!"); }
            });
        }
            
    }
        
});



// COMMAND FUNCTIONS


// Fetches a random message from the server and sends it
function sendRandom() {
    $.ajax({
        url : "http://bruno02468.com/masterbot/api.php?action=random",
        type : 'GET',
        success : function(data) { send(data); }
    });
}

// Fetches the count of logged messages and sends it
function getCount() {
    $.ajax({
        url : "http://bruno02468.com/masterbot/api.php?action=count",
        type : 'GET',
        success : function(data) { send("So far, there are " + data + " messages in the database."); }
    });
}

// Sends the title for a given YouTube video ID
function getTitle(url) {
    var video_id = url.substring(url.indexOf("v=") + 2, url.indexOf("v=") + 13);
    console.log("looking for id '" + video_id +  "'");
    $.ajax({
        url : "http://bruno02468.com/masterbot/api.php?action=youtube&id=" + video_id,
        type : 'GET',
        success : function(data) { CLIENT.submit("#cyanTitle: " + data); }
    });
}

// Look for the titles of  YouTube videos in the messages
function getTitles(message) {
    var urlpattern = /(http|https):\/\/([\w\-_]+(?:(?:\.[\w\-_]+)+))([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])/gim;
    var idpattern = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/gim;
    var urls = message.match(urlpattern);
    console.log(urls);
    for (c in urls) {
        var id = urls[c].match(idpattern)[0];
        if (id !== undefined) {
            getTitle(id);
        }
    }
}

// Answers questions
function ask(name) {
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

// Self-explanatory
function coinflip() {
    if (Math.random() < 0.5) {
        send("#orangeHeads.");
    } else {
        send("#orangeTails.");
    }
}

// Rollin'
function roll(name) {
    var rand = Math.floor(Math.random() * 90000) + 10000;
    var strn = "" + rand;
    
    var dubs = (strn[4] == strn[3]);
    var trips = (dubs && strn[3] == strn[2]);
    var quads = (trips && strn[2] == strn[1]);
    var quints = (quads && strn[1] == strn[0]);
    
    var lucky = "";
    if (dubs) { lucky = " #greendubs"; }
    if (trips) { lucky = " /!trips"; }
    if (quads) { lucky = " /!!/+quads"; }
    if (quints) { lucky = " /!!/+q/+u/+i/+n/+t/+s"; }
    
    send("#orangeThey see " + name + " rollin' " + rand + ", check 'em" + lucky + "!");
}

// Lists masters
function listMasters() {
    var msg = "#orangeMy masters are ";
    for (var i = 0; i < masters.length - 1; i++) {
        msg += masters[i] + ", ";
    }
    msg += "and " + masters[masters.length - 1] + ".";
    send(msg);
}

// Toggles the bot
function toggle(name) {
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

// Toggles "?"-in-the-end trigger for random message sending
function toggleTrigger(name) {
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

// Look up line from the database
function pick(line) {
    $.ajax({
        url : "http://bruno02468.com/masterbot/api.php?action=pick&id=" + encodeURIComponent(line),
        type : 'GET',
        success : function(data) { send(data); }
    });
}

// Gets a random image from a subreddit
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
                send("#redNo images could be found for subreddit '" + spooky + "'.");
                return;
            }
            var randomIndex = Math.floor(Math.random() * valid.length);
            var item = valid[randomIndex];
            send("\\" + item.data.title + "\n" + item.data.url);
        }).fail(function(){
            send("#redType in a valid subreddit, dummy!");
        }
    );
}

// Roulette function
function roulette(bullets) {
    var theone = Math.floor(Math.random() * 6)
    if (bullets > 6) {
        send("#redToo many bullets. Max is 6.")
    } else if (theone <= bullets - 1) {
        send("#redBang! You're dead.")
    } else {
        send("#greenYou got lucky.")
    }
}

// Gets definition of a word
function define(word) {
    $.getJSON("https://api.wordnik.com/v4/word.json/" + word + "/definitions?limit=1&includeRelated=true&sourceDictionaries=wiktionary&useCanonical=false&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5")
        .success(function(data) {
            if (data[0] === undefined) {
                send("#redNo definition could be found.");
            } else {
                send("#blue" + word + ": #cyan" + data[0].text)
            }
            return;
        }
    );
}

// Gets weather for a location
function weather(loc) {
    $.getJSON("https://query.yahooapis.com/v1/public/yql?q=select%20item.condition%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22" + loc + "%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys")
        .success(function(data) {
            if (data.query.results !== null) {
                var farenheit = data.query.results.channel.item.condition.temp;
                var celsius = (farenheit - 32) * (5 / 9);
                send('#cyanThe current temperature in ' + loc + ' is ' + farenheit + ' ºF or ' + Math.floor(celsius) + ' ºC, and current weather is: ' + data.query.results.channel.item.condition.text + ".");
            } else {
                send("#redNothing found for given location!");
            }
        }).fail(function() {
            send("#redNothing found for given location!");
        }
    );
}

// Gets location of IP
function iploc(ip) {
    $.getJSON("https://freegeoip.net/json/" + ip)
        .success(function(data) {
            if (data.city != "" && data.region_code != "" && data.country_name != "") {
                send("#cyanThe location of the IP " + ip + " is " + data.city + ", " + data.region_code + ", " + data.country_name + ".");
            } else {
                send("#redInvalid IP '" + ip + "' or location unavailable.");
            }
        }).fail(function() {
            send("#redNothing found for that IP.");
        }
    );
}

// Says something someone has leanred today
function til() {
    $.getJSON("http://api.reddit.com/r/todayilearned/hot.json?limit=100")
        .success(function(response) {
            resp = response.data.children;
            var valid = [];
            $.map(resp, function(item){
                if (item.data.is_self === false) {
                    valid.push(item);
                }
            });
            if (valid.length==0) {
                CLIENT.submit("No self posts could be found");
                return;
            }
            var randomIndex = Math.floor(Math.random() * valid.length);
            var item = valid[randomIndex].data;
            if (!item.title) {
                CLIENT.submit("#green" + item.title);
            } else if (item.title.length<100) {
                CLIENT.submit("#green"+item.title);
            } else {
                CLIENT.submit("#green"+item.title);
            }
    });
}

// Looks for a quote in a subreddit
function quote(sub) {
    $.getJSON("http://api.reddit.com/r/" + sub + "/hot.json?limit=100").success(function (response) {
        resp = response.data.children;
        var valid = [];
        $.map(resp, function (item) {
            if (item.data.selftext.length < 300) {
                valid.push(item);
            }
        });
        if (valid.length == 0) {
            CLIENT.submit("#redNo posts could be found.");
            return;
        }
        var randomIndex = Math.floor(Math.random() * valid.length);
        var item = valid[randomIndex].data;
        if (!item.selftext) {
            CLIENT.submit(item.title);
        } else {
            if (item.selftext.length < 350) {
                CLIENT.submit("\\" + item.title + "\n" + item.selftext);
            } else {
                CLIENT.submit("\\" + item.title + "\nRead More: " + item.url);
            }
        }
    });
}

// Crazy function to get the current /msg
function getMsg() {
    var sam = document.getElementById("sam");
    if (sam === null) {
        send("#redThere is currently no /msg set, it seems.");
    } else {
        var msg = escapeForSending(sam.childNodes[0].childNodes[0].childNodes[0].innerHTML).trim();
        send("The current /msg is set to: \"" + msg + "\".");
    }
}

// Toggles the bot
function toggleCursor(name) {
    if (masters.indexOf(name) > -1) {
        cursor = !cursor;
        if (cursor) {
            send("#greenAuto move cursor now enabled.");
        } else {
            CLIENT.submit("#redAuto move cursor now disabled.");
        }
    } else {
        CLIENT.submit("/pm " + name + "|#redYou do not have permission to toggle the automatic movement of the cursor. Stop it.");
    }
}
