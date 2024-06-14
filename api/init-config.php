<?php
// http config
require_once(__DIR__ . '/../config/https-redirect.php');

// debug
if($PHP_DEBUG == true){ error_reporting(E_ALL);ini_set('display_errors', 1);}

// sessão
require_once(__DIR__ . '/../config/session-config.php');
if (empty($_SESSION['idUser']) || empty($_SESSION['idStore'])) {http_response_code(401);die();}
$idUser = $_SESSION['idUser'];
$idStore = $_SESSION['idStore'];

//db
require_once(__DIR__ . '/db/db-config.php');

// utils
require_once(__DIR__ . '/utils/functions.php');

// req obj
$json = file_get_contents('php://input');
if($json){
    $json = json_decode($json,true);
}