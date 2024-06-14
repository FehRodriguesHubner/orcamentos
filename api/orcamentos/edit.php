<?php 
require_once __DIR__ . '/../init-config.php';
/////

// orcamento
$idQuote = $json['id'];
$description = $json['description'];
$instructions = $json['instructions'];
$price = $json['price'];
if(!empty($price)){
    $price = str_replace('.','',$price);
    $price = str_replace(',','.',$price);
}


validate([
    $idQuote,
    $description
]);

$sql = "UPDATE quotes SET 
    description = ?, 
    instructions = ?, 
    price = ? 
    WHERE idQuote = ? AND idStore = ?";

$stmt = mysqli_prepare($db, $sql);

if ($stmt) {
    // Associação de parâmetros
    mysqli_stmt_bind_param($stmt, "sssss", 
        $description,    
        $instructions,    
        $price,    
        $idQuote,    
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