<?php 
require_once __DIR__ . '/../init-config.php';
///


$sql = "SELECT q.*, c.name, c.phone FROM quotes q INNER JOIN clients c USING(idClient) WHERE q.idStore = '{$idStore}';";
$result = mysqli_query($db,$sql);
$rows = [];
while($row = mysqli_fetch_assoc($result) ){
    array_push($rows,$row);
}

success([
    'results' => $rows
]);

?>