<?php 
require_once __DIR__ . '/../init-config.php';
/////

$idQuote      = $json['idQuote'];
$description  = $json['description'];

validate([
    $description,
    $idQuote
]);

// orcamento
$idNote = getUUID();

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

if ($stmt) {
    // Associação de parâmetros
    mysqli_stmt_bind_param($stmt, "ssss", 
        $idNote,
        $idQuote,
        $idUser,
        $description
    );
    // Execução da consulta
    if (!mysqli_stmt_execute($stmt)) {
        error('Erro ao efetuar cadastro');
    }

} else {
   error('Erro ao preparar cadastro');
}

success();

?>