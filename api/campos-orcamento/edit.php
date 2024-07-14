<?php 
require_once __DIR__ . '/../init-config.php';
/////

// orcamento
$idCustomField = $json['id'];

$tableReference = 1;
$label          = $json['label'];
$required       = $json['required'];
$searchable     = $json['searchable'];
$editable       = $json['editable'];

validate([
    $idCustomField,
    $label,
    $required,
    $searchable,
    $editable,
    $idStore
]);

$sql = "UPDATE customFields SET 
    label = ?, 
    required = ?, 
    searchable = ?,
    editable = ?
    WHERE idCustomField = ? AND tableReference = ? AND idStore = ?";

$stmt = mysqli_prepare($db, $sql);

if ($stmt) {
    // Associação de parâmetros
    mysqli_stmt_bind_param($stmt, "siiisis", 
        $label,    
        $required,    
        $searchable,    
        $editable,
        $idCustomField,
        $tableReference,
        $idStore
    );
    // Execução da consulta
    if (!mysqli_stmt_execute($stmt)) {
        error('Erro ao efetuar atualização');
    }

} else {
    error('Erro ao preparar atualização');
}

success();

?>