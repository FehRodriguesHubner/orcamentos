<?php 
require_once __DIR__ . '/../init-config.php';
/////

////////////
$idQuote = mysqli_real_escape_string($db,$_GET['id']);

$sql = "UPDATE quotes 
    SET status = 0
    WHERE idQuote = '{$idQuote}' AND idStore = '{$idStore}';";
try{
    $result = mysqli_query($db,$sql);
}catch(Exception $ex){
    if(mysqli_errno($db) == 1451) error('Operação de exclusão indevida. Certifique-se de excluir primeiro seus dependentes',403);
    error('Falha ao tentar efetuar cancelamento');
}
success();

?>