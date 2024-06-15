<?php 
require_once __DIR__ . '/../init-config.php';
///
$idQuote = mysqli_real_escape_string($db,$json['idQuote']);

$sql = "SELECT notes.*, users.name FROM notes inner join users on notes.idUserRegister = users.idUser WHERE notes.idQuote = '{$idQuote}' order by notes.createdAt desc;";
$result = mysqli_query($db,$sql);
if(!$result) error('Falha ao buscar os dados');
$rows = [];
while($row = mysqli_fetch_assoc($result) ){
    array_push($rows,$row);
}

success([
    'results' => $rows
]);

?>