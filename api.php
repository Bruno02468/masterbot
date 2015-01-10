<?php

    /*   === api.php ===
     * 
     * This is the server-side file.
     * It contains all the functions that are best left out of the JS code.
     * It should be available for request in a PHP5-able HTTP server.
     * This is currently a work-in-progress, new functions are welcome.
     * Author: Bruno02468
     */
    
    // Bypassing same-origin policy
    header("Access-Control-Allow-Origin: *");
    
    // Requiring GET variables, VERY useful function
    function req($str) {
        if (!isset($_GET[$str])) {
            die("GET variable \"" . $str . "\" is needed for this request.");
        } else {
            return $_GET[$str];
        }
    }
    
    // basic variables
    $action = req("action");
    $logfile = "/home/bruno/Apache/masterbot.log";
    
    // Logging to server
    if ($action == "log") {
        $msg = req("msg") . "\n";
        file_put_contents($logfile, $msg, FILE_APPEND | LOCK_EX);
        die();
    }
    
    // Fetching random message
    if ($action == "random") {
        $f_contents = file($logfile);
        $line = $f_contents[array_rand($f_contents)];
        die($line);
    }
    
    // Fetching message count
    if ($action == "count") {
        $f_contents = file($logfile);
        echo count($f_contents);
    }
    
    // Fetching YouTube video title from ID
    if ($action == "youtube") {
        $id = req("id");
        try {
            $xmlInfoVideo = simplexml_load_file("https://gdata.youtube.com/feeds/api/videos/" . $id . "?v=2&fields=title");
            foreach($xmlInfoVideo->children() as $title) { $videoTitle = strtoupper((string) $title); }
            die($videoTitle);
        } catch (Exception $e) {
            die("#redUnable to find title for that video.");
        }
        die("#redUnable to find title for that video.");
    }
    
    // Fetching  specific line
    if ($action == "pick") {
        $id = req("id") + 1;
        $file = file($logfile);
        $c = count($file);
        if ($id > $c or $id <= 0) {
            die("#redBad index, max!");
        } else {
            die($file[$id]);
        }
    }
    
?>
