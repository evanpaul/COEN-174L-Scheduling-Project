<?php
$DIR = 'objects/'; // Data-store path

// Retrieve all active sessions as an array of JSON objects
function get_all_sessions(){
    $json_list = [];
    // Search all JSON objects in objects/ and push them to an array
    foreach(glob($GLOBALS['DIR'] . "*.json") as $file_name){
        $json = json_decode(file_get_contents($file_name, true), true);
        array_push($json_list, $json);
    }

    return $json_list;
}
// Get a session based on id i.e. [id].json
// Returns NULL if session is invalid
function get_session($id){
    $search = $id . '.json';
    $file_name = glob($GLOBALS['DIR'] . $search);
    // This shouldn't happen... but if it does we'll know
    if(count($file_name) > 1){
        print "[WARNING] Duplicate JSON file names!";
    }
    // Don't continue if file is invalid
    if(!$file_name[0]){
        return NULL;
    }
    $json = json_decode(file_get_contents($file_name[0]), true);

    return $json;
}
// Save a JSON string to a file
// Must provide 'id' attribute to JSON file so that it can save file as [id].json
// Will overwrite existing files with matched name
function save_session($json_string){
    $json = json_decode($json_string, true);
    $file_name = $GLOBALS['DIR'] . $json['id'] . ".json";

    $result = file_put_contents($file_name, $json_string);

    if(!$result || !$json['id']){
        print "[ERROR] Unable to write to file!";
    }
}
?>
