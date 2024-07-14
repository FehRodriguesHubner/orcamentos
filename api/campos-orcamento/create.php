<?php 
require_once __DIR__ . '/../init-config.php';
/////

$tableReference = 1;
$label          = $json['label'];
$required       = $json['required'];
$searchable     = $json['searchable'];
$editable       = $json['editable'];
$type       = $json['type'];

validate([
    $label,
    $required,
    $searchable,
    $editable
]);

// orcamento
$idCustomField = getUUID();

$sql = "INSERT INTO customFields(
    idCustomField,
    idStore,
    tableReference,
    label,
    required,
    searchable,
    editable,
    type
) VALUES(
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?
);";

$stmt = mysqli_prepare($db, $sql);

if ($stmt) {
    // Associação de parâmetros
    mysqli_stmt_bind_param($stmt, "ssisiiis", 
        $idCustomField,
        $idStore,
        $tableReference,
        $label,
        $required,
        $searchable,
        $editable,
        $type
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