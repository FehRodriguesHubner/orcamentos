<?php 
require_once __DIR__ . '/../init-config.php';
/////

////////////
$idCustomField = mysqli_real_escape_string($db,$_GET['id']);
$tableReference = 1;
validate([$idCustomField]);

$sql = "DELETE FROM customFields WHERE idCustomField = '{$idCustomField}' AND tableReference = {$tableReference} AND idStore = '{$idStore}';";
try{
    $result = mysqli_query($db,$sql);
}catch(Exception $ex){
    if(mysqli_errno($db) == 1451) error('Operação de exclusão indevida. Certifique-se de excluir primeiro seus dependentes',403);
    error('Falha ao tentar efetuar exclusão');
}
success();

?>