<?php

include 'data.php';

if(isset($_GET['id'])){
    $pattern = '/^[0-9a-z]{10}$/';
    if(preg_match($pattern, $_GET['id'])){
        echo json_encode(get_session($_GET['id']));
    }else{
        echo "INVALID";
    }
}

?>
