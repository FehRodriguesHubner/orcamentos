<?php

require_once __DIR__ . '/../../config/init-config.php';

?>

<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- dependencies -->
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,700;0,800;1,400&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="<?php echo $cdn ?>libs/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="<?php echo $cdn; ?>/libs/fontawesome/css/all.min.css">
    <link rel="stylesheet" href="<?php echo $cdn ?>libs/sweetalert2/css/sweetalert2.min.css">
    <!-- datatables -->
    <link rel="stylesheet" type="text/css" href="<?php echo $cdn; ?>libs/jquery-datatable/datatables.min.css">
    <link rel="stylesheet" type="text/css" href="<?php echo $cdn; ?>libs/jquery-datatable/css/buttons.bootstrap5.min.css">
    <link rel="stylesheet" type="text/css" href="<?php echo $cdn; ?>libs/jquery-datatable/css/dataTables.bootstrap5.min.css">


    <!-- styles global -->
    <link rel="stylesheet" href="<?php echo $cdn ?>css/styles.css">
    <link rel="stylesheet" href="<?php echo $cdn ?>css/cms.css">
    <link rel="stylesheet" href="<?php echo $url; ?>css/adm-styles.css">

    <title>Orçamentos</title>
    <link rel="apple-touch-icon" sizes="180x180" href="<?php echo $url;?>apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="<?php echo $url;?>favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="<?php echo $url;?>favicon-16x16.png">
    <link rel="manifest" href="<?php echo $url;?>site.webmanifest">
    <link rel="mask-icon" href="<?php echo $url;?>safari-pinned-tab.svg" color="#5bbad5">
    <meta name="msapplication-TileColor" content="#da532c">
    <meta name="theme-color" content="#ffffff">
</head>

<body>
    <main class="d-flex">

        <?php
        require_once __DIR__ . '/../../template/aside.phtml';
        ?>

        <section class="wrapper-contents">
            <?php require_once __DIR__ . '/../../template/header.phtml'; ?>
            <section class="main-wrapper-contants">

                <header class="d-flex justify-content-between align-items-center mb-2 mb-md-4">
                    <h3 class="title-header">Orçamentos</h3>
                    <a href="<?php echo $url;?>orcamentos/cadastrar">
                        <button class="button-default bg-blue color-white" hover="brightness">Cadastrar</button>
                    </a> 
                </header>



                <div id="datatables-models" class="card-profile p-lg-4 p-md-3 p-2">

                    <div class="datatables-container p-3 p-md-4 d-flex">
                        <div class="d-flex gap-5 flex-column">
                            <div style="width:600px;height:40px;" class="placeholder-custom-size"></div>
                            <div style="width:800px;height:40px;" class="placeholder-custom-size"></div>
                            <div style="width:800px;height:40px;" class="placeholder-custom-size"></div>
                            <div style="width:600px;height:40px;" class="placeholder-custom-size"></div>
                        </div>
                    </div>

                </div>

            </section>
        </section>
    </main>

    <!-- libs -->
    <!-- <script src="<?php echo $cdn ?>libs/swiper/swiper-bundle.min.js"></script> -->
    <!-- dependencies -->
    <script src="<?php echo $cdn ?>libs/axios/axios.min.js"></script>
    <script src="<?php echo $cdn ?>libs/jquery/js/jquery.min.js"></script>
    <script src="<?php echo $cdn ?>libs/bootstrap/js/bootstrap.bundle.js"></script>

    <!-- default imports -->
    <script src="<?php echo $cdn ?>libs/sweetalert2/js/sweetalert2.min.js"></script>
    <script src="<?php echo $cdn ?>js/global.js"></script>
    <script src="<?php echo $url ?>js/adm-global.js"></script>
    <!-- datatables -->
    <script src="<?php echo $cdn; ?>libs/jquery-datatable/datatables.min.js"></script>
    <script src="<?php echo $cdn; ?>libs/jquery-datatable/js/dataTables.bootstrap5.min.js"></script>
    <script src="<?php echo $cdn; ?>libs/qrcode/qrcode.min.js"></script>
    <script src="<?php echo $cdn; ?>libs/jquery-datatable/js/dataTables.buttons.min.js"></script>
    <script src="<?php echo $cdn; ?>libs/jquery-datatable/js/buttons.flash.min.js"></script>
    <script src="<?php echo $cdn; ?>libs/jquery-datatable/js/jszip.min.js"></script>
    <script src="<?php echo $cdn; ?>libs/jquery-datatable/js/pdfmake.min.js"></script>
    <script src="<?php echo $cdn; ?>libs/jquery-datatable/extensions/export/vfs_fonts.js"></script>
    <script src="<?php echo $cdn; ?>libs/jquery-datatable/js/buttons.html5.min.js"></script>
    <script src="<?php echo $cdn; ?>libs/jquery-datatable/js/buttons.print.min.js"></script>
    <!-- page script -->
    <script src="<?php echo $cdn ?>/js/cms/cms.js"></script>
    <script src="<?php echo $url; ?>/js/orcamentos/list.js<?php echo $jsVersion;?>"></script>

</body>

</html>