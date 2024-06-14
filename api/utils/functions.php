<?php

function success($response = null,$status = 200){
    http_response_code($status);

    if($response === null){
        $response = ['success' => true];
    }else 
    if(is_string($response)){
        $response = ['success' => true, 'message' => $response];
    } else
    if(is_array($response)){
        $response['success'] = true;
    }else{
        die();
    }

    die(json_encode($response, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));

}

function error($response = null,$status = 500){
    global $db;
    http_response_code($status);

    if($response === null){
        $response = ['error' => true, 'dbError' => mysqli_error($db)];

    }else if(is_string($response)){
        $response = ['error' => true, 'message' => $response, 'dbError' => mysqli_error($db)];

    } else if(is_array($response)){
        $response['error'] = true;

    }else{
        die($response);
    }

    die(json_encode($response, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));

}

function getUUID(){
    global $db;

    $sql = "SELECT UUID() as id;";
    $result = mysqli_query($db,$sql);
    $row = mysqli_fetch_assoc($result);
    return $row['id'];
}


function sendReq($endpoint,$payload, $method = "POST", $timeout = 10)
{

    $url = $endpoint;
    $data = $payload;

    
    $jsonData = json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    $ch = curl_init($url);
    
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT_MS, ($timeout * 1000));
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        "Content-Type: application/json"
    ));

    $response = curl_exec($ch);

    if ($response === false) {
        return [
            'status' => 500,
            'response' => [
                'message' => "Tempo de solicitação expirado."
            ]
        ];
    }

    

    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    curl_close($ch);
    
    $responseData = json_decode($response, true);

    if ($responseData) {
        return [
            'status' => $httpCode,
            'response' => $responseData
        ];
    } else {
        return [
            'status' => $httpCode,
            'url' => $url,
            'response' => [
                'message' => "Ocorreu um erro ao verificar o retorno da solicitação"
            ]
        ];
    }
}

function validate($arrayValidate){
    foreach($arrayValidate as $input){
        if($input == null){
            error('Verifique os dados informados e tente novamente.',400);
        }
    }
}

function procuraCliente($phone){
    global $idStore, $db;
    $sql = "SELECT idClient FROM clients WHERE idStore = '{$idStore}' AND phone = '{$phone}';";
    $result = mysqli_query($db,$sql);
    if(!$result) error('Falha ao buscar por registros do cliente',500);
    if(mysqli_num_rows($result) < 1) return false;
    $row = mysqli_fetch_assoc($result);
    return $row;
}

function registraCliente($phone,$name){
    global $idStore, $db;

    $idClient = getUUID();

    $sql = "INSERT INTO clients(
        idClient,
        idStore,
        phone,
        name
    ) VALUES(
        ?,
        ?,
        ?,
        ?
    );";

    $stmt = mysqli_prepare($db, $sql);

    if ($stmt) {
        // Associação de parâmetros
        mysqli_stmt_bind_param($stmt, "ssss", $idClient,$idStore,$phone,$name);
        // Execução da consulta
        if (!mysqli_stmt_execute($stmt)) {
            error('Falha ao executar cadastro do cliente');
        }

    } else {
        error('Falha ao preparar cadastro do cliente');
    }

    return $idClient;
}