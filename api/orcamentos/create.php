<?php 
require_once __DIR__ . '/../init-config.php';
/////

mysqli_begin_transaction($db);

// cliente
$idClient   = isset($json['idClient']) ? $json['idClient'] : null;
$phone      = $json['phone'];
$name       = $json['name'];

// orcamento
$description = $json['description'];
$instructions = $json['instructions'];
$price = $json['price'];
if(!empty($price)){
    $price = str_replace('.','',$price);
    $price = str_replace(',','.',$price);
}else{
    $price = null;
}

validate([
    $description
]);

// cliente
if($idClient == null){
    validate([$phone,$name]);

    $client = procuraCliente($phone);

    if(!$client){
        $idClient = registraCliente($phone,$name);
    }else{
        $idClient = $client['idClient'];
    }
}

// orcamento
$idQuote = getUUID();

$sql = "INSERT INTO quotes(
    idQuote,
    idStore,
    idUserRegister,
    idClient,
    status,
    description,
    instructions,
    price
) VALUES(
    ?,
    ?,
    ?,
    ?,
    1,
    ?,
    ?,
    ?
);";

$stmt = mysqli_prepare($db, $sql);

if ($stmt) {
    // Associação de parâmetros
    mysqli_stmt_bind_param($stmt, "sssssss", 
        $idQuote,
        $idStore,
        $idUser,
        $idClient,
        $description,
        $instructions,
        $price
    );
    // Execução da consulta
    if (!mysqli_stmt_execute($stmt)) {
        error('Erro ao efetuar cadastro');
    }

} else {
   error('Erro ao preparar cadastro');
}

// customFields
$tableReference = 1;
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