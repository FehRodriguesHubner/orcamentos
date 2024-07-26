<?php 
require_once __DIR__ . '/../init-config.php';
/////

$idQuote = mysqli_real_escape_string($db,$_GET['id']);
validate([$idQuote]);

$sql = "SELECT q.*, c.name, c.phone FROM quotes q INNER JOIN clients c USING(idClient) WHERE q.idQuote = '{$idQuote}' and q.idStore = '{$idStore}';";
if(!$result = mysqli_query($db,$sql)) error('Falha ao buscar dados');
if(mysqli_num_rows($result)< 1) error('Registro não encontrado no sistema',400);
$row = mysqli_fetch_assoc($result);

$customFieldContents = getCustomFieldContents($idQuote);

$timestampCreatedAt = strtotime($row['createdAt']);
$dataEmissao = date('d/m/Y H:i',$timestampCreatedAt);
$dataValidade = date('d/m/Y',strtotime('+30 days'));

$row = [
    ...$row,
    ...$customFieldContents,

    "dataEmissao" => $dataEmissao,
    "dataValidade" => $dataValidade,
    "codReferencia" => $timestampCreatedAt
];

success($row);
?>