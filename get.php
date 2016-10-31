<?php

include 'data.php';

if(isset($_GET['id'])){
    echo json_encode(get_session($_GET['id']));
}

?>
