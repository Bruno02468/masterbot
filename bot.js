/* +=========================================================================+
 * |                                                                         |
 * |              Masterbot, the coolest Spooks bot!                         |
 * |                                                                         |
 * |      Main programmer: Bruno02468                                        |
 * |    Other programmers: Randomguy_, Mr. Guy and KitsumiTheFox             |
 * |              License: GNU GPLv3                                         |
 * |                                                                         |
 * |                                                                         |
 * |    Do not run this code, instead, use the run script provided           |
 * |    in the GitHub to make sure you're running the latest version.        |
 * |                                                                         |
 * |                                                                         |
 * |    Also, please edit the help variable accordingly                      |
 * |    in case you change commands.                                         |
 * |                                                                         |
 * |    Thanks.                                                              |
 * |                                                                         |
 * |       ~ Bruno02468                                                      |
 * |                                                                         |
 * +=========================================================================+
 */


// Defining some basic functions and variables
var disabled = false;
var botnick = "Masterbot";

// People who can control the bot
var masters = ["Bruno02468", "sammich", "Randomguy_", "Mr.Guy", "LAMP", "InfraRaven", "Kevin"];

// People who can't use the bot
var banned = ["gaybutts", "DoomsdayMuffinz", "Anonymous", "fingers"];

// Sent when someone issues !help
var help  = "#cyanI am Masterbot, a creation of Bruno02468, with code from Randomguy and Mr. Guy!\n";
    help += "Commands:\n";
    help += "         !help: Get some help when using the bot!\n";
    help += "         !checkem: Roll a random 5-digit number.\n";
    help += "         !coinflip: Self-explanatory, I believe.\n";
    help += "         !ask: Ask me a yes/no question.\n";
    help += "         !image [subreddit]: Shows an image from a subreddit of your choice.\n";
    help += "         !quote [subreddit]: Returns a quote from the selected subreddit.\n";
    help += "         !define [word]: Defines a word.\n";
    help += "         !roulette [n]: Plays russian roulette with n bullets.\n";
    help += "         !weather [city, state/country]: Gives you the weather for a part of the world.\n";
    help += "         !til: Gives a random fact someone learned. Learn something new!\n";
    help += "         !get msg: Retrieves the current /msg.\n";
    help += "         !radio: Retrieves the URL for the Spooks Radio Stream.\n";
    help += "         !track [main, rock, hardstyle]: See what's currently blasting on Spooks Radio!\n";
    help += "         !interject [something]: I'd just like to interject for a moment...\n";
    help += "         !duel [username]: (BROKEN) Get reusable links to duel someone in Rock-Paper-Scissors.\n";
    help += "         !math [math]: I can do math too!\n";
    help += "         !how2math: An introduction to math.js.\n";
    help += "         !insult [someone]: Insult them!\n";
    help += "         !compliment [someone]: Compliment them to make up for it.\n";
    help += "         !lispify [something]: Generate Lisp code for some text.";
    
var mathhelp  = "#cyanHere's how to do math with Masterbot.\n"
    mathhelp += "         You can input simple math expressions, like /%9 + 10|.\n";
    mathhelp += "         You can also use functions, like sin(), cos(), sqrt() and others.\n";
    mathhelp += "         It also supports boolean logic (/%true|, /%false|) and binary operators such as & (AND) and \| (OR).\n";
    mathhelp += "         You can evaluate equality with /%==|, such as /%a = 1; a == -1|.\n";
    mathhelp += "         You can define variables, but they only exist within that command, like with /%a = 3;|.\n";
    mathhelp += "         You can convert units, like in /%50cm in inch| or /%50 kilogram in lb|.\n";
    mathhelp += "         Always separate statements with semicolons, like in /%a = 3; a - 4;|. Use multiple lines if you want.\n";
    mathhelp += "         Only the last statement is outputted in the answer, but all are executed.\n";
    mathhelp += "         Refer to http://mathjs.org/ for more details.";

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

// Load math.js
$('head').append('<script src="http://cdnjs.cloudflare.com/ajax/libs/mathjs/1.5.0/math.min.js"></script>');

// Send message and trigger anti-spam
function send(text) {
    if (!antiSpam && score < 7 && !disabled) {
        CLIENT.submit(text);
        spamFilters();
    }
}

// Wrapper for PMing a user
function pm(user, message) {
    send("/pm " + user + "|" + message);
}

// Make a JS link
function jslink(script, text) {
    return "/?javascript:" + script + "|[" + text + "]|";
}

// Make a JS link to PM the current user something
function pmlink(message, text) {
    return jslink("CLIENT.submit('/pm " + botnick + "\\|" + message + "');", text);
}

// Lists online users
function getOnlineUsers() {
    var online = [];
    for (var c in ONLINE.models) {
        if (ONLINE.models[c].attributes)
            online.push(ONLINE.models[c].attributes.nick);
    }
    return online;
}

// Check whether a user is online
function isOnline(user) {    
    return (getOnlineUsers().indexOf(user) > -1);
}

// Fetching something via a XMLHttpRequest
function ajaxGet(url) {
    var request = null;
    request = new XMLHttpRequest();
    request.open("GET", url, false);
    request.send(null);
    return request.responseText;
}

// Used when making unsafe cross-domain requests
function crossGet(url) {
    return ajaxGet("http://bruno02468.com/cors.php?url=" + encodeURIComponent(url));
}

// Escaping strings
function escapeForSending(string) {
    var pat = /\/(?:)/gi;
    return string.replace(pat, "\\/");
}

// Case insensitive string lookup function
String.prototype.contains = function(it) { 
    return this.toLowerCase().indexOf(it.toLowerCase()) != -1;
};

// Pick random item from array
Array.prototype.randomItem = function() {
    return this[Math.floor(Math.random()*this.length)];
};

// Username popup and flair setter, basic setup
function setup() {
    if (CLIENT.get("nick") !== botnick)
    {
        CLIENT.submit("/login bottybot " + botnick);
    }
    //if the bot is still not logged in, try /nick
    if (CLIENT.get("nick") !== botnick)
    {
        CLIENT.submit("/nick " + botnick);
    }

    CLIENT.submit("/safe");
    CLIENT.set("part", "to get repaired by Bruno");
    CLIENT.set("mask", "brunos.secret.bot.laboratory");
    CLIENT.set("flair", "$Montserrat|#808080/^" + botnick);
    CLIENT.set("font", "sans");
    CLIENT.set("frame", "off");
    CLIENT.set("mute", "on");
}
if (!allset) {
    setup();
    allset = true;
}

// All set up, tell the user.
CLIENT.show("Masterbot now running!");


// Begin logging process and listen for commands
function handler(data) {
    if (data.nick === undefined) {
        return false;
    }
    var name = data.nick;
    var text = data.message.trim();
    var trueMessage = parser.removeHTML(parser.parse(text));
    trueMessage = trueMessage.trim();
    var argumentString = trueMessage.substring(trueMessage.indexOf(" ") + 1).trim();
    var argumentsArray = argumentString.split(" ");
    
    if (name !== botnick && !(banned.indexOf(name) > -1)) {
        
        // COMMAND HANDLERS
        // name = the person who issued the command
        // argumentString = everything after the command
        // argumentsArray = all the whitespace-defined words after the command
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
            pm(name, help);
        } else if (text.contains("watch?v=") || text.contains("youtu.be")) {
            getTitles(text);
        } else if (text.contains("!count")) {
            getCount();
        } else if (text.contains("!til")) {
            til();
        } else if (text.contains("!get msg")) {
            getMsg();
        } else if (text.contains("!image")) {
            image(argumentString, name);
        } else if (text.contains("!inject")) {
            inject(name, argumentString);
        } else if (text.contains("!roulette")) {
            roulette(argumentString);
        } else if (text.contains("!define")) {
            define(argumentString);
        } else if (text.contains("!weather")) {
            weather(argumentString);
        } else if (text.contains("!quote")) {
            quote(argumentString);
        } else if (text.contains("!block")) {
            blockban(name, argumentString);
        } else if (text.contains("!unblock")) {
            unblockban(name, argumentString);
        } else if (text.contains("!radio")) {
            send("#cyanYou can listen to Spooks Radio here: http://spooksradio.tk");
        } else if (text.contains("!track")) {
            getSong(argumentString);
        } else if (text.contains("!pick")) {
            pick(argumentString, true);
        } else if (text.contains("!stream")) {
            send("#cyanSpooks Radio Stream: http://216.170.123.121:8000/listen.pls?sid=1");
        } else if (text.contains("!frame")) {
            frame(argumentString); 
        } else if (text.contains("!corkboard")) {
            corkboard(argumentString); 
        } else if (text.contains("!banlist")) {
            banlist(name);
        } else if (text.contains("!interject")) {
            interject(argumentString);
        } else if (text.contains("!random")) {
            sendRandom();
        } else if (text.contains("!duel")) {
            duel(name, argumentString);
        } else if (text.contains("!rps")) {
            startGame(name, argumentsArray[0], argumentsArray[1]);
        } else if (text.contains("!play")) {
            play(name, argumentsArray[0], argumentsArray[1]);
        } else if (text.contains("!math")) {
            doMath(argumentString);
        } else if (text.contains("!update")) {
            update(name);
        } else if (text.contains("!how2math")) {
            pm(name, mathhelp);
        } else if (text.contains("!insult")) {
            insult(name, argumentString);
        } else if (text.contains("!compliment")) {
            compliment(name, argumentString);
        } else if (text.contains("!lispify")) {
            lispify(argumentString);
        }
            
    }
        
}
if (!listening) {
    CLIENT.on('message', handler);
    listening = true;
}


// ==============================
// |     COMMAND FUNCTIONS      |
// ==============================
//
// These are called when a user issues a command, to keep
// the command handlers themselves short and clean.

// Sends the title for a given YouTube video URL
function getTitle(url) {
    var html = crossGet(url);
    var video_id = url.split('v=')[1];
    var ampersandPosition = video_id.indexOf('&');
    if (ampersandPosition !== -1) {
        video_id = video_id.substring(0, ampersandPosition);
    }
    var myparser = new DOMParser();
    var xmlDocument = myparser.parseFromString(html, "text/html");
    var title = xmlDocument.getElementById("eow-title").innerHTML.replace(/\n/, "").trim();
    var thumb = "\n                     https://img.youtube.com/vi/" + video_id + "/default.jpg"
    CLIENT.submit("#cyanTitle: " + title + thumb);
}

// Look for the titles of  YouTube videos in the messages
function getTitles(message) {
    var urlpattern = /(http|https):\/\/([\w\-_]+(?:(?:\.[\w\-_]+)+))([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])/gim;
    var idpattern = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/gim;
    var urls = message.match(urlpattern);
    for (var c in urls) {
        getTitle(urls[c]);
    }
}

// Generate Lisp code from string
function lispify(s) {
    if (s.toLowerCase() == "!lispify") {
        send("Nothing specified.");
        return;
    }
    var result = "$Source Code Pro|##black#white\n";
    var lines = s.split("\n")
    for (var i = 0; i < lines.length; i++) {
        var words = lines[i].split(" ");
        var end = "";
        for (var j = 0; j < words.length; j++) {
            result += "( " + words[j] + " ";
            end += ")";
        }
        result += end + "\n";
    }
    send(result);
}

// Generate Lisp code from user input

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

// Coin flipping
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
    
    var lucky = ", check those ";
    if (quints) { lucky += "/!!/+q/+u/+i/+n/+t/+s"; }
    else if (quads) { lucky += "/!!/+quads"; }
    else if (trips) { lucky += "/!trips"; }
    else if (dubs) { lucky += "#greendubs"; }
    else { lucky = ""; }
    
    send("#orange" + name + " rolled " + rand + lucky + "#orange!");
}

// List masters
function listMasters() {
    var msg = "#orangeMy masters are ";
    for (var i = 0; i < masters.length - 1; i++) {
        msg += masters[i] + ", ";
    }
    msg += "and " + masters[masters.length - 1] + ".";
    send(msg);
}

// Toggle the bot
function toggle(name) {
    if (masters.indexOf(name) > -1) {
        disabled = !disabled;
        if (!disabled) {
            send("#greenMasterbot now enabled.");
        } else {
            CLIENT.submit("#redMasterbot now disabled.");
        }
    } else {
        pm(name, "#redYou do not have permission to toggle me. Stop it.");
    }
}

// Update the bot
function update(name) {
    if (masters.indexOf(name) > -1) {
        var newscript = ajaxGet("http://bruno02468.com/masterbot/script.php");
        if (newscript == script) {
            CLIENT.submit("#cyan/*Bot is already up to date.");
        } else {
            CLIENT.submit("#cyan/*Bot updated to latest version.");
            try {
                window.eval.call(window, newscript);
                script = newscript;
            } catch (err) {
                CLIENT.submit("#red/*Error found when updating: /_" + err.message + "|.");
            }
        }
    } else {
        pm(name, "#redYou do not have permission to update me. Stop it.");
    }
}

// Block someone from using the bot
function blockban(name, target) {
    if (masters.indexOf(name) > -1) {
        if (!(banned.indexOf(target) > -1)) {
            CLIENT.submit("#redMaster " + name + " has blocked " + target + " from using the bot.");
            banned.push(target);
        } else {
            CLIENT.submit("#redMaster " + name + ", that user is already blocked.");
        }
    } else {
        pm(name, "#redYou do not have permission to do that. Stop it.");
    }
}

// Unblock someone from using the bot
function unblockban(name, target) {
    if (masters.indexOf(name) > -1) {
        var ind = banned.indexOf(target);
        if (ind > -1) {
            CLIENT.submit("#greenMaster " + name + " has unblocked " + target + " from using the bot.");
            banned.splice(ind, 1);
        } else {
            CLIENT.submit("#redMaster " + name + ", that user is not blocked.");
        }
    } else {
        pm(name, "#redYou do not have permission to do that. Stop it.");
    }
}

// List blocked users
function banlist(name) {
    if (masters.indexOf(name) > -1) {
        pm(name, "#cyanBan list: [" + banned + "].");
    } else {
        pm(name, "#redYou do not have permission to do that. Stop it.");
    }
}

// Gets a random image from a subreddit
function image(spooky, caller) {
    if (!(spooky.contains("scat") || spooky.contains("poop") || spooky.contains("shit"))) {
        $.getJSON("https://api.reddit.com/r/" + spooky + "/hot.json?limit=100")
            .done(function(response) {
                resp = response.data.children;
                var valid = [];
                $.map(resp, function(item){
                    if(/\.(?:gif|jpg|jpeg|png|bmp)$/gi.exec(item.data.url))
                        valid.push(item);
                    });
                if (valid.length === 0) {
                    pm(caller, "#redNo images could be found for subreddit '" + spooky + "'.");
                    return;
                }
                var randomIndex = Math.floor(Math.random() * valid.length);
                var item = valid[randomIndex];
                pm(caller, "\\" + item.data.title + "\n" + item.data.url);
            }).fail(function(){
                pm(caller, "#redType in a valid subreddit, dummy!");
            }
        );
    }
}

// Roulette function
function roulette(bullets) {
    var theone = Math.floor(Math.random() * 6);
    if (bullets > 6) {
        send("#redToo many bullets. Max is 6.");
    } else if (theone <= bullets - 1) {
        send("#redBang! You're dead.");
    } else {
        send("#greenYou got lucky.");
    }
}

// Gets definition of a word
function define(word) {
    $.getJSON("https://api.wordnik.com/v4/word.json/" + word
    + "/definitions?limit=1&includeRelated=true&sourceDictionaries=wiktionary&useCanonical=false&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5")
        .success(function(data) {
            if (data[0] === undefined) {
                send("#redNo definition could be found.");
            } else {
                send("#blue" + word + ": #cyan" + data[0].text);
            }
            return;
        }
    );
}

// Gets weather for a location
function weather(loc) {
    $.getJSON("https://query.yahooapis.com/v1/public/yql?q=select%20item.condition%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22" 
    + loc + "%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys")
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
            if (valid.length === 0) {
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
        if (valid.length === 0) {
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

// Say the current track on Spooks Radio
function getSong(stream) {
    if (stream == "!track" || stream == "main") {
        var songname = ajaxGet("http://spooksradio.tk/currentsong_bruno.php");
    } else {
        try {
            var songname = ajaxGet("http://" + stream + ".spooksradio.tk/currentsong_bruno.php");
        } catch (err) {
            send("#redInvalid stream! Try main, rock or hardstyle.");
            return;
        }
    }
    if (!songname || songname == "") {
        var songname = "nothing at the moment";
    }
    send("#cyanSpooks Radio is currently playing " + songname + ".");
    
}

// I'd just like to interject for a moment...
function interject(s) {
    s = escapeForSending(s.trim());
    if (!s || s.toLowerCase() == "!interject") {
        s = "Linux";
    }
    var quote = "/%I'd just like to interject for a moment. What you're referring to as "
              + s + " is, in fact, GNU\/" + s + ", or as I've recently taken to calling it, GNU plus " + s + ".";
    send(quote);
}

// Inject JS -- Bruno only
function inject(name, js) {
    if (name == "Bruno02468") {
        window.eval.call(js);
    }
}

// Do us some math
function doMath(someMath) {
    if (someMath == "!math" || someMath == undefined) {
        send("#cyanPlease enter a valid math.js expression.");
        return false;
    }
    try {
        var answer = math.eval(someMath);
        send("#cyanAnswer: $Source Code Pro|" + answer);
    } catch (err) {
        send("#cyanI do math, not... that. /_" + err.message + "|.");
    }
}

// Generate an article for a word
function article(word) {
    var vowels = ["a", "e", "i", "o", "u"];
    if (vowels.indexOf(word[0]) > -1) {
        return "an";
    }
    return "a";
}

// Insult generator :-)
function makeInsult(who) {
    
    var gross = ["shit", "feces", "cocaine", "weed", "butthole", "dog-ass",
    "dick-cheese", "blood-clot", "ballsack", "testicle", "gasoline", "cum",
    "fart", "sulphur", "dirt", "ash", "baby-powder", "toilet-paper", "dick",
    "male-genitalia", "female-genitalia", "dog-poo", "baking-soda",
    "pussy", "goat-fur", "mite", "insect", "dildo", "tree", "Starbucks",
    "Haskell-code", "Star-Wars", "Star-Trek", "K-pop", "iPhone", "iMac",
    "Apple", "Steve-Jobs", "garbage", "battery-acid", "ass", "smegma",
    "penis", "little-children", "coffee", "iPod", "sperm"];
    
    var gerunds = ["sucking", "licking", "eating", "loving", "fiddling",
    "sniffing", "snorting", "swallowing", "hugging", "sexualizing",
    "desexualizing", "fetishizing", "smelling", "drinking"];
          
    var adjectives = ["aggressive", "aloof", "arrogant", "belligerent",
    "bitchy", "boastful", "bone-idle", "boring", "bossy", "callous",
    "careless", "changeable", "clinging", "compulsive", "conservative",
    "cruel", "cunning", "cynical", "dirty", "deceitful", "detached",
    "domineering", "finicky", "flirtatious", "foolish", "foolhardy", "fussy",
    "grumpy", "gullible", "harsh ", "impatient", "impolite", "impulsive",
    "inconsistent", "indecisive", "indiscreet", "inflexible", "interfering",
    "irresponsible", "jealous", "lazy", "Machiavellian", "materialistic",
    "miserly", "moody", "narrow-minded", "nasty", "naughty", "nervous",
    "obstinate", "overcritical", "overemotional", "parsimonious", "patronizing",
    "perverse", "pessimistic", "pompous", "possessive", "pusillanimous",
    "quick-tempered", "resentful", "rude", "ruthless", "sarcastic", "secretive",
    "selfish", "self-centred", "self-indulgent", "silly", "sneaky", "stingy",
    "stupid", "superficial", "tactless", "timid", "touchy", "thoughtless",
    "unkind", "unpredictable", "unreliable", "unsuccessful", "untidy",
    "vain", "vengeful", "vulgar", "weak-willed", "poor", "chromosome-lacking",
    "chromosome-shuffled", "brain-dead", "shitty", "crappy", "buggy", "laggy",
    "squeaky", "gooey", "rotten-brained", "spooky", "Brazilian", "American",
    "unemployed", "low-intelligence", "circumcised", "underaged", "over",
    "fedora-tipping", "fedora-wearing", "privileged", "fat-ass", "submissive",
    "useless", "show-on-head", "dishonest", "dogmatic", "greedy", "big-headed",
    "cantankerous", "cowardly", "inconsiderate",  "intolerant", "mean",
    "obsessive",  "quarrelsome", "stubborn", "truculent",  "untrustworthy",
    "vague", "chromosome-bearing", "muddy", "sweaty", "radical", "filthy"];
    
    var things = ["dolt", "idiot", "retard", "dumbass", "capitalist",
    "cock-smoker", "pedophile", "4channer", "8channer", "narcissist",
    "scum of the Earth", "fuckwit", "bumbaclot", "son of a bitch", "bad friend",
    "shithead", "wind-headed", "empty vase", "toilet paper", "brony", "furry",
    "belieber", "communist", "liberal", "republican", "democrat", "socialist",
    "one-directioner", "drug user", "drug addict", "part of NEET",
    "Dinkleberg", "piece of goat testicles", "ambientalist", "flip-flop", "SJW",
    "tumblr activist", "slacktivist", "couch potato", "ass gremlin", "cheater",
    "jock", "welfare leech", "failed abortion", "fetus", "sad cum", "hippie",
    "programmer", "redditor", "sex toy", "nerd", "slug", "bunch of sticks",
    "Applefag", "summerfag", "jailbait", "flat earther", "Christian", "atheist",
    "shitlord", "cum dumpster", "asshole", "ass", "ass ray", "ass bread",
    "half-wit", "flip-flop", "tard", "wannabe", "gonnabe", "dickweed", "leech",
    "sponge", "snick-snack"];
    
    var gr = gross.randomItem();
    var ar = article(gr);
    var ge = gerunds.randomItem();
    var ad = adjectives.randomItem();
    var th = things.randomItem();
    
    return "You, " + who + ", are " + ar + " " + gr + "-" + ge + " " + ad + " "
            + th + ".";
}

// Insult someone
function insult(caller, who) {
    if (who == "!insult") {
        insult(caller, caller);
        return false;
    }
    var theInsult = makeInsult(who);
    send(theInsult);
}

// Compliment generator
function makeCompliment(who) {
    
    var adverbs = ["very", "extremely", "unebelivably", "absolutely", "highly",
    "uniquely", "deeply", "strongly", "delightfully", "astonishingly"];
          
    var adjectives = ["adaptable", "adventurous", "affable", "affectionate",
    "agreeable", "ambitious", "amiable", "amicable", "amusing", "brave",
    "broad-minded", "calm", "caring", "charming", "communicative",
    "conscientious", "considerate", "convivial", "courageous", "courteous",
    "decisive", "determined", "diligent", "diplomatic", "discreet", "dynamic",
    "easygoing", "emotional", "energetic", "enthusiastic", "exuberant",
    "faithful", "fearless", "forceful", "frank", "friendly", "funny", 
    "gentle", "good", "gregarious", "hard-working", "helpful", "honest",
    "imaginative", "impartial", "independent", "intellectual", "intelligent",
    "intuitive", "inventive", "kind", "loving", "loyal", "modest", "neat",
    "nice", "optimistic", "passionate", "patient", "persistent ", "pioneering",
    "philosophical", "placid", "plucky", "polite", "powerful", "practical",
    "pro-active", "quick-witted", "rational", "reliable", "reserved",
    "resourceful", "romantic", "self-confident", "self-disciplined", "sensible",
    "sensitive", "sincere", "sociable", "straightforward", "sympathetic",
    "thoughtful", "tidy", "tough", "unassuming", "understanding", "versatile",
    "warmhearted", "willing", "humorous", "generous", "witty", "fair-minded",
    "creative", "compassionate", "bright", "handsome", "cute", "sexy",
    "beautiful"];
    
    var person = ["person", "comrade", "friend", "patriot", "partner", "winner",
    "human being", "personality", "carbon-based life form"];
    
    var good = ["good", "great", "awesome", "perfect"];
    
    var verbs = ["looking", "smelling", "tasting", "feeling"];
    
    var ubody = ["teeth", "hair", "genitalia", "legs", "arms", "hands",
    "nails", "eyes", "toes", "pubes", "armpits", "elbows", "shoulders"];
    var cbody = ["/*ASS|", "nose", "butt"];
    var body = [ubody, cbody];
    
    
    var av = adverbs.randomItem();
    var ad = adjectives.randomItem();
    var ax = article(av);
    var pr = person.randomItem();
    var gd = good.randomItem();
    var ar = "some";
    var vb = verbs.randomItem();
    var bd = body.randomItem().randomItem();
    if (cbody.indexOf(bd) > -1) {
        ar = article(gd);
    }
    
    return "You, " + who + ", are " + ax + " " + av + " " + ad + " " + pr + ", with "
           + ar + " " + gd + "-" + vb + " " + bd + " right there!";

}

// Compliment someone
function compliment(caller, who) {
    if (who == "!compliment") {
        compliment(caller, caller);
        return false;
    }
    var theCompliment = makeCompliment(who);
    send(theCompliment);
}

// ======================
//  Rock-Paper-Scissors!
// ======================

// Definind some variables
var games = [];
var id = -1;
var banned = ["gaybutts", "DoomsdayMuffinz", "Anonymous", "fingers"];
var rock = "rock";
var paper = "paper";
var scissors = "scissors";
var quit = "quit";

// Generate a game ID
function gameId() {
    id++;
    return id;
}

// Give someone reusable links for dueling a user
function duel(caller, subject) {
    if (!isOnline(subject)) {
        pm(caller, "#redThat user is not online!");
        return false;
    }
    var invitation = "#orangeYou asked to duel " + subject + " in a fair game "
                   + "of rock-paper-scissors. Pick your arms.";
    var lrock = pmlink("!rps " + subject + " " + rock, "Rock!");
    var lpaper = pmlink("!rps " + subject + " " + paper, "Paper!");
    var lscissors = pmlink("!rps " + subject + " " + scissors, "Scissors!");
    var lquit = pmlink("!rps " + subject + " " + quit, "Uh... nevermind.");
    invitation += "#orange\\n" + lrock + "\\n" + lpaper + "\\n" + lscissors
                + "\\n" + lquit + "\n(Tip: /_these links are reusable!|)";
    pm(caller, invitation);
}

// Start a game between two users
function startGame(caller, subject, start) {
    if (!isOnline(subject)) {
        pm(caller, "#redThat user is not online!");
        return false;
    } else if (start == "quit") {
        send("#red" + caller + " just gave up on dueling " + subject + "!");
    } else {
        var myId = gameId();
        var lrock = pmlink("!play " + rock + " " + myId, "Rock!");
        var lpaper = pmlink("!play " + paper + " " + myId, "Paper!");
        var lscissors = pmlink("!play " + scissors + " " + myId, "Scissors!");
        var lquit = pmlink("!play " + quit + " " + myId, "I'm a coward.");
        var invitation = "#green" + caller + " has challenged you for a fair "
                      + "duel of Rock-Paper-Scissors!\\nPick your arms or run.";
        invitation += "#orange\\n" + lrock + "\\n" + lpaper + "\\n" + lscissors
                   + "\\n" + lquit;
        pm(subject, invitation);
        games.push([caller, subject, start, false]);
    }
}

// When the challenged user picks an option...
function play(caller, command, id) {
    var game = games[id];
    var ended = game[3];
    if (ended) {
        pm(caller, "#redThat game has already ended, dummy!");
    } else if (command == quit) {
        send("#red" + caller + " just pussied out of a fair Rock-Paper-Scissors duel against " + game[0] + "!");
    } else {
        games[id][3] = true;
        var start = game[2];
        var starter = game[0];
        var end = runGame(start, command);
        if (end == "tie") {
            send("#orangeThe duel between " + starter + " and " + caller + " has ended in a #redTIE#yellow!");
        } else {
            var winner = starter;
            var loser = caller;
            if (end == "b") {
                winner = caller;
                loser = starter;
            }
            send("#orangeHonorful /_" + winner + "| defeated /_" + loser + "| on a duel of Rock-Paper-Scissors!");
        }
    }
}

// Run game for two strings, returns result, or false for invalid input
function runGame(a, b) {
    a = a.toLowerCase();
    b = b.toLowerCase();
    if (a !== rock && a !== paper && a !== scissors || b !== rock && b !== paper && b !== scissors) {
        return false;
    }
    
    if (a == b) {
        return "tie";
    }
    
    if (a == rock) {
        if (b == scissors) {
            return "a";
        } else {
            return "b";
        }
    }
    if (a == paper) {
        if (b == rock) {
            return "a";
        } else {
            return "b";
        }
    }
    if (a == scissors) {
        if (b == paper) {
            return "a";
        } else {
            return "b";
        }
    }   
}
