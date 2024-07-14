<?php 
require_once __DIR__ . '/../init-config.php';
///
$tableReference = 1;
$customFields = getCustomFields($tableReference);

success([
    'results' => $customFields
]);

?>