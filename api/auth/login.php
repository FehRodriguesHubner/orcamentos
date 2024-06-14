<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once(__DIR__ . '/../../config/session-config.php');
require_once(__DIR__ . '/../../config/https-redirect.php');
require_once(__DIR__ . '/../db/db-config.php');
$json = file_get_contents('php://input');
$json = json_decode($json,true);


$email = $json['email'];
$pass = $json['pass'];

$array_validate = [$email,$pass];
foreach($array_validate as $input){
    if($input == null || $input == ''){
        http_response_code(400);
        die(json_encode(['message' => 'Credenciais não informadas']));
    }
}

// Preparação da consulta
$sql = "SELECT 
    u.idUser,
    s.idStore,
    u.`name`,
    s.`label` as storeName
    FROM users u
    INNER JOIN stores s USING(idStore)
    WHERE u.email = ? AND u.password = md5(?) 
    LIMIT 1;
";

$stmt = mysqli_prepare($db, $sql);

if ($stmt) {
    // Associação de parâmetros
    mysqli_stmt_bind_param($stmt, "ss", $email, $pass);
    // Execução da consulta
    if (!mysqli_stmt_execute($stmt)) {
        http_response_code(500);
        die(json_encode(['message' => 'Erro ao verificar credenciais', 'debug' => mysqli_error($db)]));
    }

} else {
    http_response_code(500);
    die(json_encode(['message' => 'Erro ao inciar verificação das credenciais', 'debug' => mysqli_error($db)]));
}
// Obter um resultado
if(!$result = mysqli_stmt_get_result($stmt)){
    http_response_code(500);
    die(json_encode(['message' => 'Erro ao verificar credenciais', 'debug' => mysqli_error($db)]));
}
if(mysqli_num_rows($result) < 1){
    http_response_code(403);
    die(json_encode(['message' => 'Credenciais inválidas']));
}

$row = mysqli_fetch_assoc($result);

$idUser = $row['idUser'];
$name = $row['name'];
$idStore = $row['idStore'];
$storeName = $row['storeName'];

$_SESSION['idUser'] = $idUser;
$_SESSION['name'] = $name;
$_SESSION['email'] = $email;
$_SESSION['idStore'] = $idStore;
$_SESSION['storeName'] = $storeName;

// Fechar a declaração
mysqli_stmt_close($stmt);

http_response_code(200);
die(json_encode([
    'message' => 'Login realizado com sucesso',
    'name' => $name,
    'email' => $email,
    'idUser' => $idUser,
    'idStore' => $idStore,
    'storeName' => $storeName,
]));
