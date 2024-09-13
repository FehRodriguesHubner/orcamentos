<?php
require_once __DIR__ . '/../../config/https-redirect.php';

require_once __DIR__ . '/../../config/session-config.php';

session_destroy();

?>
<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,700;0,800;1,400&display=swap"
        rel="stylesheet">
    <link rel="stylesheet" href="<?php echo $cdn?>libs/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" href="<?php echo $cdn?>libs/swiper/swiper-bundle.min.css">
    <link rel="stylesheet" href="<?php echo $cdn?>libs/sweetalert2/css/sweetalert2.min.css">

    <link rel="stylesheet" href="<?php echo $cdn?>css/styles.css">
    <link rel="stylesheet" href="<?php echo $cdn?>css/auth-styles.css">

    <title>Admin Login</title>
    <link rel="apple-touch-icon" sizes="180x180" href="<?php echo $url;?>apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="<?php echo $url;?>favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="<?php echo $url;?>favicon-16x16.png">
<link rel="manifest" href="<?php echo $url;?>site.webmanifest">
<link rel="mask-icon" href="<?php echo $url;?>safari-pinned-tab.svg" color="#5bbad5">
<meta name="msapplication-TileColor" content="#da532c">
<meta name="theme-color" content="#ffffff">
</head>

<body>
    <input type="hidden" id="url" value="<?php echo $url;?>"/>
    <div id="page-loader" class="loader-wrapper d-flex justify-content-center align-items-center vw-100 vh-100 flex-column">
        <img class="logo-loader" src="<?php echo $cdn;?>img/logo-colorido.png" alt="Logo"/>
    </div>

    <main>
        <div class="form-wrapper">
            <div class="form-container position-relative d-flex">
                <section class="form-box">
                    <!-- LOGO 
                    <a href="<?php echo $cdn?>" class="logo">
                        <img width="213" src="<?php echo $cdn;?>img/logo-color.png" alt="Logo"/>
                    </a>-->
                    <div class="form-content d-flex flex-column">
                        <!-- TITLE -->
                        <h1 class="form-title mb-3">Login administrativo</h1>
                        <!-- FORM -->
                        <form id="form-login" method="POST" class="form-items d-flex flex-column mt-1">
                            <!-- EMAIL -->
                            <div class="input-container d-flex flex-column mb-3">
                                <div class="input-box d-flex">
                                    <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M13.6 0.666016H2.4C1.76348 0.666016 1.15303 0.918872 0.702944 1.36896C0.252856 1.81905 0 2.4295 0 3.06602V11.066C0 11.7025 0.252856 12.313 0.702944 12.7631C1.15303 13.2132 1.76348 13.466 2.4 13.466H13.6C14.2365 13.466 14.847 13.2132 15.2971 12.7631C15.7471 12.313 16 11.7025 16 11.066V3.06602C16 2.4295 15.7471 1.81905 15.2971 1.36896C14.847 0.918872 14.2365 0.666016 13.6 0.666016ZM13.064 2.26602L8 6.06602L2.936 2.26602H13.064ZM13.6 11.866H2.4C2.18783 11.866 1.98434 11.7817 1.83431 11.6317C1.68429 11.4817 1.6 11.2782 1.6 11.066V3.26602L7.52 7.70602C7.65848 7.80987 7.8269 7.86602 8 7.86602C8.1731 7.86602 8.34152 7.80987 8.48 7.70602L14.4 3.26602V11.066C14.4 11.2782 14.3157 11.4817 14.1657 11.6317C14.0157 11.7817 13.8122 11.866 13.6 11.866Z" fill="#5A646E"/>
                                    </svg>
                                    <input id="email" class="input" placeholder="Email" type="email"/>
                                </div>
                                <small class="input-message"></small>
                            </div>
                            <!-- PASS -->
                            <div class="input-container d-flex flex-column  mb-3">
                                <div class="input-box d-flex">
                                    <svg width="14" height="17" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 6.66602H11V4.66602C11 2.46045 9.20556 0.666016 7 0.666016C4.79444 0.666016 3 2.46045 3 4.66602V6.66602H2C0.895437 6.66602 0 7.56145 0 8.66602V14.666C0 15.7706 0.895437 16.666 2 16.666H12C13.1046 16.666 14 15.7706 14 14.666V8.66602C14 7.56145 13.1046 6.66602 12 6.66602ZM4.5 4.66602C4.5 3.28761 5.62159 2.16602 7 2.16602C8.37841 2.16602 9.5 3.28761 9.5 4.66602V6.66602H4.5V4.66602ZM12.5 14.666C12.5 14.9417 12.2757 15.166 12 15.166H2C1.72431 15.166 1.5 14.9417 1.5 14.666V8.66602C1.5 8.39033 1.72431 8.16602 2 8.16602H12C12.2757 8.16602 12.5 8.39033 12.5 8.66602V14.666Z" fill="#5A646E"/>
                                    </svg>
                                    <input id="password" class="input" placeholder="Senha" type="password"/>
                                </div>
                                <small class="input-message"></small>
                            </div>
                            <!-- SUBMIT BUTTON -->
                            <div class="mt-3">
                                <button class="button-submit-form button-default bg-blue color-white py-3">
                                    Entrar
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            </div>
            <div class="form-overlay"></div>
            <!-- <div class="login-image-container" style="background-image: url(<?php echo $cdn?>img/login.png);"></div> -->
        </div>
    </main>
    
    <script src="<?php echo $cdn?>libs/sweetalert2/js/sweetalert2.min.js"></script>
    <script src="<?php echo $cdn?>libs/jquery/js/jquery.min.js"></script>
    <script src="<?php echo $cdn?>libs/jquery-mask/jquery.mask.min.js"></script>
    <script src="<?php echo $cdn?>js/auth-scripts.js"></script>
    <script src="<?php echo $cdn?>js/global.js"></script>
    <script src="<?php echo $url?>js/adm-global.js"></script>
    
    <script src="<?php echo $url?>js/auth/login.js"></script>


 
</body>

</html>