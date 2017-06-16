<?php
function DeleteMaj($files) {
    $array = array();
    $test = false;
    foreach ($files as $file) {
        if (!$test) {
            $test = true;
            continue;
        }
        $buffer = file_get_contents($file);
        $trueArray = array();
        $trueArray = array_merge($trueArray, explode("\n", $buffer));
        for ($i = 0; $i < sizeof($trueArray); ++$i) {
            if(ctype_upper($trueArray[$i])){
                unset($trueArray[$i]);
            }
        }
        $array = array_merge($array, $trueArray);
        file_put_contents("nomaj.txt", json_encode($array));
    }
}

DeleteMaj($argv);