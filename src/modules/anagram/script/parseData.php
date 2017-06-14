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
    $exception = array(
        'i',
        'ii',
        'iii',
        'iv',
        'v',
        'vi',
        'vii',
        'viii',
        'ix',
        'x',
        'xi',
        'xii',
        'xiii',
        'xiv',
        'xv',
        'xvi',
        'xvii',
        'xviii',
        'xix',
        'xx',
        'xxi',
        'xxii',
        'xxiii',
        'xxiv',
        'xxv',
        'xxvi',
        'xxvii',
        'xxviii',
        'xxix',
        'xxx',
        'xxxi',
        'xxxii',
        'xxxiii',
        'xxxiv',
        'xxxv',
        'xxxvi',
        'xxxvii',
        'xxxviii',
        'xxxix',
        'xl',
        'xli',
        'xlii',
        'xliii',
        'xliv',
        'xlv',
        'xlvi',
        'xlvii',
        'xlviii',
        'xlix',
        'l',
        'l',
        'li',
        'lii',
        'liii',
        'liv',
        'lv',
        'lvi',
        'lvii',
        'lviii',
        'lix',
        'lx',
        'lxi',
        'lxii',
        'lxiii',
        'lxiv',
        'lxv',
        'lxvi',
        'lxvii',
        'lxviii',
        'lxix',
        'lxx',
        'lxxi',
        'lxxii',
        'lxxiii',
        'lxxiv',
        'lxxv',
        'lxxvi',
        'lxxvii',
        'lxxviii',
        'lxxix',
        'lxxx',
        'lxxxi',
        'lxxxii',
        'lxxxiii',
        'lxxxiv',
        'lxxxv',
        'lxxxvi',
        'lxxxvii',
        'lxxxviii',
        'lxxxix',
        'xc',
        'xci',
        'xcii',
        'xciii',
        'xciv',
        'xcv',
        'xcvi',
        'xcvii',
        'xcviii',
        'xcix',
        'c',
        'ci',
        'cii',
        'ciii',
        'civ',
        'cv',
        'cvi',
        'cvii',
        'cviii',
        'cix',
        'cx',
        'cxi',
        'cxii',
        'cxiii',
        'cxiv',
        'cxv',
        'cxvi',
        'cxvii',
        'cxviii',
        'cxix',
        'cxx',
        'cxxi',
        'cxxii',
        'cxxiii',
        'cxxiv',
        'cxxv',
        'cxxvi',
        'cxxvii',
        'cxxviii',
        'cxxix',
        'cxxx',
    );
    $test = false;
    $array = array();
    foreach ($files as $file) {
        if (!$test) {
            $test = true;
            continue;
        }
        $buffer = file_get_contents($file);
        $buffer = str_to_noaccent($buffer);
        $buffer = strtolower($buffer);
        $buffer = preg_replace("/[^a-z ]/", ' ', $buffer);
        $array  = array_merge($array, explode(" ", $buffer));
    }
    $words = array_unique($array);
    $result = "";
    foreach ($words as $word) {
        if (in_array($word, $exception)) {
            continue;
        }
        $alpha = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for ($j = 0; $j < strlen($word); ++$j) {
            if (ord(substr($word, $j, 1)) - 97 < 26) {
                ++$alpha[ord(substr($word, $j, 1)) - 97];
            }
        }
        $code = "";
        for ($j = 0; $j < 26; ++$j) {
            $code = $code . $alpha[$j] . ",";
        }
        $result[$code][] = $word;
    }
    file_put_contents("../database/database.json", json_encode($result));
}

//Give a book in text format, and it will extract all words (example in truedata directory)
parseData($argv);
