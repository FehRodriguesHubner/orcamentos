<?php 
require_once __DIR__ . '/../init-config.php';
/////

$idCustomFields = mysqli_real_escape_string($db,$_GET['id']);
validate([$idCustomFields]);

$sql = "SELECT * FROM customFields WHERE idCustomField = '{$idCustomFields}' and idStore = '{$idStore}';";
if(!$result = mysqli_query($db,$sql)) error('Falha ao buscar dados');
if(mysqli_num_rows($result)< 1) error('Registro não encontrado no sistema',400);
$row = mysqli_fetch_assoc($result);
success($row);
?>