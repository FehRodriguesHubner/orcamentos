var baseAdminUrl, apiUrl = null;

baseAdminUrl = $('#url').val();
apiUrl = `${baseAdminUrl}api`;

async function fetchReq(endpoint, body = {}, method = 'POST'){
    return new Promise(async function (res, rej) {

        let fetchResponse = await fetch(apiUrl + '/' + endpoint, {
            method,
            headers: {
                'Accept': 'application/json'
            },
            body: JSON.stringify(body)
        });

        var jsonRequestData;

        try {

            jsonRequestData = await fetchResponse.json();

        } catch (except) {
            console.log(except);
            dispatchPopup('error','Ops! ocorreu um erro.','Não foi possível ao verificar o resultado de sua ação. Por favor, tente novamente mais tarde.');
            rej({except});
            return;

        }

        if (fetchResponse.status != 200) {
            dispatchPopup('warning','Atenção',jsonRequestData.message);
            rej(json);
        }

        res(jsonRequestData);
    });

}

function popupLoading(text = 'Aguarde'){
    return dispatchPopup('info','Processando...',text,{
        didOpen: () => {
            Swal.showLoading()
        },
        showConfirmButton: false,
        allowOutsideClick: false
    });
}

function fetchUserData() {
    return new Promise(async function (res, rej) {

        let email = getCookie('email');
        let name = getCookie('name');
        let emp_name = getCookie('emp_name');
        let role = getCookie('role');

        res({
            userData: {
                id_user: 1,
                name: name,
                email: email,
                emp_name: emp_name,
                role: role
            }
        });

    });
}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie() {
    let token = getCookie("token");
}

function checkInstancia(redirect = true) {

    let status = $('#status-instancia').val() == 1 ? true : false;
    console.log('status instancia', status);

    if (status == false) {
        dispatchPopup(
            'warning',
            'Instância não conectada',
            'Certifique-se de configurar sua instância antes de acessar essa funcionalidade'
        ).then(function () {
            if (redirect) {
                location.href = baseAdminUrl;
            }
        });

        return false;
    }

    return true;

}

function verificarNumeroTelefone(numero) {
    // Remover caracteres não numéricos
    numero = numero.toString();

    if (numero.charAt(0) === "+") {
        return numero;
    }

    numero = numero.replace(/\D/g, '');

    if (numero.length < 10) {
        return false;
    }

    switch (numero.length) {
        case 10:
        case 11:
            numero = "55" + numero;
            break;
        case 13:
        case 12:
            // Mantém o número inalterado
            break;
        default:
            return false;
    }

    return numero;
}

function formatDateTime(mariaDBDateTime) {
    // Separar a data e a hora
    const [date, time] = mariaDBDateTime.split(' ');

    // Separar ano, mês e dia
    const [year, month, day] = date.split('-');

    // Separar horas e minutos (ignorando segundos)
    const [hour, minute] = time.split(':');

    // Formatar para o formato desejado
    const formattedDateTime = `${day}/${month}/${year} ${hour}:${minute}`;

    return formattedDateTime;
}
