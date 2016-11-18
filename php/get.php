<?php

include 'data.php';
if(isset($_GET['id'])){
    $pattern = '/^[0-9a-z]{10}$/';
    $id = $_GET['id'];
    $output = 'ERROR'; // Shouldn't occur... nothing catches this on the front-end
    // Check if given ID conforms to our regex
    if(preg_match($pattern, $id)){
        $session = get_session($id);
        if($session){ // Check if session is null... if an error appears here then be more explicit with NULL check
            $output = json_encode(get_session($id));
        }else{
            $output = "NULL";
        }
    }else{
        $output =  "INVALID";
    }
    $error = $id.":::".$output
    logger($output);
    echo $output;
}

?>
