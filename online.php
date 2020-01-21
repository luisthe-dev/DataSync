<?php

    function Connection(){
        $DB = array(
            'host' => 'localhost',
            'user' => 'root',
            'pass' => '',
            'name' => 'Sync'
        );
        return $Connection = mysqli_connect($DB['host'], $DB['user'], $DB['pass'], $DB['name']);
    }

    function fetchData(){
        $Connection = Connection();
        $Fetch = "SELECT * FROM Data";
        $Answer = mysqli_query($Connection, $Fetch);
        if(mysqli_num_rows($Answer) == 0){
            return 'No_Data';
        }else{
            $Array = array();
            while($Grouped = mysqli_fetch_array($Answer)){
                array_push($Array, $Grouped);
            }
            return json_encode($Array);
        }
    }

    if($_POST['Ace'] == 'Sync'){
        echo fetchData();
    }

?>