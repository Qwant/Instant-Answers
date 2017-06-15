<?php

function str_to_noaccent($str)
{
    $str = preg_replace('#Ç#', 'C', $str);
    $str = preg_replace('#ç#', 'c', $str);
    $str = preg_replace('#è|é|ê|ë#', 'e', $str);
    $str = preg_replace('#È|É|Ê|Ë#', 'E', $str);
    $str = preg_replace('#à|á|â|ã|ä|å#', 'a', $str);
    $str = preg_replace('#@|À|Á|Â|Ã|Ä|Å#', 'A', $str);
    $str = preg_replace('#ì|í|î|ï#', 'i', $str);
    $str = preg_replace('#Ì|Í|Î|Ï#', 'I', $str);
    $str = preg_replace('#ð|ò|ó|ô|õ|ö#', 'o', $str);
    $str = preg_replace('#Ò|Ó|Ô|Õ|Ö#', 'O', $str);
    $str = preg_replace('#ù|ú|û|ü#', 'u', $str);
    $str = preg_replace('#Ù|Ú|Û|Ü#', 'U', $str);
    $str = preg_replace('#ý|ÿ#', 'y', $str);
    $str = preg_replace('#Ý#', 'Y', $str);

    return ($str);
}

function parseData($files) {
    $test = false;
    $array = array();
    foreach ($files as $file) {
        if (!$test) {
            $test = true;
            continue;
        }
        $buffer = file_get_contents($file);
        $trueArray = array();
        $trueArray = array_merge($trueArray, explode("\n", $buffer));
        $buffer = str_to_noaccent($buffer);
        $buffer = strtolower($buffer);
        $array  = array_merge($array, explode("\n", $buffer));
    }
    $result = "";
    $i = 0;
    foreach ($array as $word) {
        $alpha = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for ($j = 0; $j < strlen($word); ++$j) {
            if (ord(substr($word, $j, 1)) - 97 < 26 && ord(substr($word, $j, 1)) - 97 >= 0) {
                ++$alpha[ord(substr($word, $j, 1)) - 97];
            }
        }
        $code = "";
        for ($j = 0; $j < 26; ++$j) {
            $code = $code . $alpha[$j] . ",";
        }
        $result[$code][] = $trueArray[$i];
        ++$i;
    }
    file_put_contents("../database/database.json", json_encode($result));
}

//Give a file containing lot of words in argument
parseData($argv);
