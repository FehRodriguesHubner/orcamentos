<?php 
require_once __DIR__ . '/../init-config.php';
/////

$idQuote = mysqli_real_escape_string($db,$_GET['id']);
validate([$idQuote]);

$sql = "SELECT q.*, c.name, c.phone FROM quotes q INNER JOIN clients c USING(idClient) WHERE q.idQuote = '{$idQuote}' and q.idStore = '{$idStore}';";
if(!$result = mysqli_query($db,$sql)) error('Falha ao buscar dados');
if(mysqli_num_rows($result)< 1) error('Registro não encontrado no sistema',400);
$row = mysqli_fetch_assoc($result);
success($row);
?>