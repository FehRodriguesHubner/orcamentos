<?php 
require_once __DIR__ . '/../init-config.php';
///

// Receber parâmetros do DataTables
$draw = $_POST['draw'];
$start = $_POST['start'];
$length = $_POST['length'];
$searchValue = $_POST['search']['value'];

// Montar a cláusula WHERE para busca, se houver
$where = "WHERE q.idStore = '{$idStore}'";
if (!empty($searchValue)) {
    $where .= "AND 
        (c.name LIKE '%{$searchValue}%' OR c.phone LIKE '%{$searchValue}%') OR
        (cf.searchable = 1 AND cfc.content LIKE '%{$searchValue}%')
    ";

}

// Obter o número total de registros (sem filtro)
$sqlTotal = "SELECT COUNT(*) as total FROM quotes q INNER JOIN clients c USING(idClient) WHERE q.idStore = '{$idStore}'";
$resultTotal = mysqli_query($db, $sqlTotal);
$rowTotal = mysqli_fetch_assoc($resultTotal);
$totalRecords = $rowTotal['total'];

// Obter o número de registros filtrados
$sqlFiltered = "SELECT COUNT(*) as filtered 
    FROM quotes q 
    INNER JOIN clients c USING(idClient) 
    LEFT JOIN customFieldContents cfc ON cfc.idTableReference = q.idQuote
    LEFT JOIN customFields cf ON cfc.idCustomField = cf.idCustomField
    {$where}";
$resultFiltered = mysqli_query($db, $sqlFiltered);
$rowFiltered = mysqli_fetch_assoc($resultFiltered);
$totalFiltered = $rowFiltered['filtered'];

// Obter os dados paginados
$sqlData = "SELECT 
    q.*, c.name, c.phone
    FROM quotes q INNER JOIN clients c USING(idClient)
    LEFT JOIN customFieldContents cfc ON cfc.idTableReference = q.idQuote
    LEFT JOIN customFields cf ON cfc.idCustomField = cf.idCustomField
    {$where} GROUP BY q.idQuote ORDER BY q.createdAt DESC LIMIT {$start}, {$length}";
$resultData = mysqli_query($db, $sqlData);
$rows = [];
while($row = mysqli_fetch_assoc($resultData)){
    $idQuote = $row['idQuote'];
    $customFieldContents = getCustomFieldContents($idQuote);
    $row = [
        ...$row,
        ...$customFieldContents
    ];

    array_push($rows, $row);
}

// Retornar a resposta no formato esperado pelo DataTables
$response = [
    'draw' => intval($draw),
    'recordsTotal' => intval($totalRecords),
    'recordsFiltered' => intval($totalFiltered),
    'data' => $rows
];

success($response);

?>