<?php 
require_once __DIR__ . '/../init-config.php';
/////

mysqli_begin_transaction($db);

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

// customFields
$tableReference = 1;

deleteCustomFields($idQuote);

$customFields = getCustomFields($tableReference);

$sql = "SELECT idCustomFieldContent 
    FROM customFieldContents 
    WHERE idTableReference = '{$idQuote}'
    AND idCustomField = '{$idCustomField}'
;";
if(!$result = mysqli_query($db,$sql)) error('Falha ao buscar dados personalizados');
$currentCustomFields = [];
while($row = mysqli_fetch_assoc($result)) $currentCustomFields[$row['idCustomField']] = $row;

foreach($customFields as $customField){
    $idCustomField = $customField['idCustomField'];
    if($json[$idCustomField] === null) continue;
    insertCustomField($idCustomField,$idQuote,$json[$idCustomField]);
}

mysqli_commit($db);
success();

?>