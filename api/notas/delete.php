<?php 
require_once __DIR__ . '/../init-config.php';
/////

////////////
$idNote = mysqli_real_escape_string($db,$json['idNote']);
validate([$idNote]);

$sql = "DELETE FROM notes WHERE idNote = '{$idNote}';";
try{
    $result = mysqli_query($db,$sql);
}catch(Exception $ex){
    if(mysqli_errno($db) == 1451) error('Operação de exclusão indevida. Certifique-se de excluir primeiro seus dependentes',403);
    error('Falha ao tentar efetuar cancelamento');
}
success();

?>