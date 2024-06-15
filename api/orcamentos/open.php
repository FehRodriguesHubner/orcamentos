<?php 
require_once __DIR__ . '/../init-config.php';
/////

mysqli_begin_transaction($db);

$idQuote = mysqli_real_escape_string($db,$json['id']);

$sql = "UPDATE quotes 
    SET status = 1
    WHERE idQuote = '{$idQuote}' AND idStore = '{$idStore}';";
try{
    $result = mysqli_query($db,$sql);
}catch(Exception $ex){
    if(mysqli_errno($db) == 1451) error('Operação de exclusão indevida. Certifique-se de excluir primeiro seus dependentes',403);
    error('Falha ao tentar efetuar reabertura');
}

// registra anotação
$idNote = getUUID();
$description = "<b><i>Orçamento reaberto</i></b>";
$sql = "INSERT INTO notes(
    idNote,
    idQuote,
    idUserRegister,
    description
) VALUES(
    ?,
    ?,
    ?,
    ?
);";
$stmt = mysqli_prepare($db, $sql);
if (!$stmt) error('Erro ao salvar registro');
mysqli_stmt_bind_param($stmt, "ssss", 
    $idNote,
    $idQuote,
    $idUser,
    $description
);
if (!mysqli_stmt_execute($stmt)) error('Erro ao efetuar registro');

mysqli_commit($db);

success();

?>