const pageSlug = 'orcamentos';
const pageName = 'Orçamentos';
const campos = [
    {label:'Descrição do problema (Visível ao cliente na O.S)', key: 'description', type: FIELD_TYPE_TEXTAREA},
    {label:'Detalhamento de serviço (NÃO visível ao cliente na O.S)', key: 'instructions', type: FIELD_TYPE_TEXTAREA, required:false},
    {label:'Valor do orçamento', key: 'price', type:FIELD_TYPE_MONEY, required:false},
    {label:'Nome do Cliente', key: 'name', readonly:true},
    {label:'Telefone do Cliente', key: 'phone', type: FIELD_TYPE_PHONE, readonly:true}
];
var content = null;

window.addEventListener('DOMContentLoaded', async function () {
    renderUserDataReplace();
    renderHeaderPath([{
        label: '<i class="fa-solid fa-house"></i> ' + pageName,
        link: null
    }]);
    renderPageActive(pageSlug);
    ///////////////////////////

    var customFields;
    try{
        customFields = await getCustomFields(TABLE_REFERENCE_QUOTES);
        for(let field of customFields){
            field.key = field.idCustomField;
            campos.push(field);
        }
    }catch(ex){return;}

    console.log(campos);
    renderDefaultForm();
    renderNoteForm();

});

$(function(){
    $(document).on('focus','input', function(){
        cleanInputError(this);
    });

    // submit
    $('#form-edit').on('submit',async function(ev){
        ev.preventDefault();
        ev.stopImmediatePropagation();
        let erros = 0;
        const jsonCampos = {};
        for(let campo of campos){
            const element = $(`#input-${campo.key}`);
            const type = element.attr('data-type');
            if(
                (element.attr('data-optional') != null && element.val().trim() != '') ||
                element.attr('data-optional') == null
            ){
                if (!inputValidation(element.val().trim(),type)) {
                    triggerInputError(element, 'Verifique o valor informado!');
                    erros++
                }
            }
            jsonCampos[campo.key] = element.val().trim();
        }
        if (erros > 0) {
            dispatchPopup('warning','Atenção', 'Verifique os campos destacados.');
            return null;
        }
        const id = $('#get_id').val();
        jsonCampos.id = id;

        let services = [];
        $('[data-servico]').each(function(){
            let desc = $(this).find('[name="desc"]').val().trim();
            let price = $(this).find('[name="price"]').val().trim();
            price = price.replaceAll('.','');
            price = price.replaceAll(',','.');
            price = parseFloat(price);


            if(desc.trim() != ''){
                services.push({
                    desc,
                    price
                });
            }

        });

        jsonCampos.services = services;
        // REQUISIÇÃO
        popupLoading();

        let fetchResponse = await fetch(`${apiUrl}/${pageSlug}/edit.php`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body:JSON.stringify(jsonCampos)
        });

        if(fetchResponse.status != 200){
            dispatchPopup('error','Ops! ocorreu um erro.','Não foi possível ao verificar o resultado de sua ação. Por favor, tente novamente mais tarde.');

            return false;

        }

        dispatchPopup('success','Pronto!','Atualização realizada com sucesso.').then(function(){
            window.location.reload();
        });

    });

    $('#form-notes').on('submit', async function(ev){
        ev.preventDefault();
        ev.stopImmediatePropagation();

        const txtNote = $('#txtNote');
        if (!inputValidation(txtNote.val().trim(),null)) {
            dispatchPopup('warning','Atenção', 'Preencha o campo de anotações antes de prosseguir.');
            return;
        }

        popupLoading();
        
        const idQuote = $('#get_id').val();
        try{
            jsonResponse = await fetchReq(`notas/create.php`,{
                "idQuote": idQuote,
                "description": txtNote.val().trim()
            });
        }catch(except){ console.log(except); return;}

        //dispatchPopup('success','Pronto!', 'Anotação inserida!');
        txtNote.val('');
        Swal.close();
        renderNoteForm();

    });

    $('#btnOrcamento').on('click', function(){
        let dataEmissao,dataValidade, codReferencia, nome, telefone, descricao, valor, valorTotal, services;
        
        dataEmissao = content.dataEmissao;
        dataValidade = content.dataValidade;
        codReferencia = content.codReferencia;
        services = content.services;
        nome = content.name;
        telefone = content.phone;

        let price = content.price;
        if(price == null) {
            price = 0; 
        }
        
        let priceServices = 0;
        if(services != null){
            services = JSON.parse(services);
            if(services.length > 0){
                for(let service of services){
                    if(service.price > 0 ){
                        priceServices += service.price;
                    }
                }
            }
        }else{
            services = [];
        }
        
        descricao = content.description;

        if(content.status >= 2){
            descricao += ` <br/><br/> ` + content.instructions;
            dataValidade = null;
        }

        valorTotal = price > priceServices ? price : priceServices;
        valorTotal = valor = 'R$ '+parseFloat(valorTotal).toLocaleString('pt-br',{minimumFractionDigits: 2});

        let htmlOS = templateOS({
            values:content,
            services,
            dataEmissao,dataValidade, codReferencia, nome, telefone, descricao, valor, valorTotal
        });

        // Create a new window object
        const newTab = window.open('', '_blank');

        // Set the document content of the new tab to the HTML string
        newTab.document.open();
        newTab.document.write(htmlOS);
        newTab.document.close();

        // Focus on the newly opened tab
        newTab.focus();

    });

    $(document).on('click','[data-deletar-note]',async function(){
        const idNote = $(this).attr('data-id');
        dispatchPopup('warning','Atenção','Tem certeza que deseja excluir essa nota?',{showCancelButton:true,cancelButtonText:'Cancelar',confirmButtonText:'Deletar'}).then(async function(res){
            if(res.isConfirmed){
                popupLoading();
                try{
                    jsonResponse = await fetchReq(`notas/delete.php`,{
                        "idNote": idNote
                    });
                }catch(except){ console.log(except); return;}
        
                renderNoteForm();
                Swal.close();
            }
        });
    });

    $('#btnAddService').on('click', function(){
        appendService();
        maskInputs();

    });

})

function fetchDefault() {
    return new Promise(async function (res, rej) {
        const id = $('#get_id').val();
        let fetchResponse = await fetch(`${apiUrl}/${pageSlug}/get.php?id=${id}`, {
            method: 'GET'
        });

        let fetchJsonResponse;

        if (fetchResponse.status == 401) {window.location.href = baseAdminUrl;return;}
        if (fetchResponse.status != 200) {
            dispatchPopup(
                'error',
                'Ops!',
                'Ocorreu um erro ao buscar as informações necessárias. Por favor, atualize a página ou volte novamente mais tarde'
            ).then(function(){
                location.href = baseAdminUrl;
            });

            rej(false);

            return;
        }


        try {
            fetchJsonResponse = await fetchResponse.json();
        } catch (except) {

            dispatchPopup(
                'error',
                'Ops!',
                'Ocorreu um erro ao analisar as informarções necessárias. Por favor, atualize a página ou volte novamente mais tarde'
            ).then(function(){
                location.href = baseAdminUrl;
            });

            rej(false);
            return;
        }

        res(fetchJsonResponse);

    });
}

async function renderDefaultForm(){
    var result;
    try{
        result = await fetchDefault();
    }catch(e){
        console.log(e);
        return;
    }

    if(result === false){
        return false;
    }

    content = result;
    
    
    for(let campo of campos){
        // adiciona campo
        
        renderInput(campo,result);
    }

    if(result.services != null){

        let services = JSON.parse(result.services);

        if(services.length > 0){
            for(let service of services){
                appendService(service);
            }
        }
    }else{
        appendService();

    }

    maskInputs();

    renderRequired()
    
}
async function renderNoteForm(){
    const idQuote = $('#get_id').val();
    let jsonResponse;
    try{
        jsonResponse = await fetchReq(`notas/list.php`,{
            "idQuote": idQuote
        });
    }catch(except){ console.log(except); return;}

    const notesRow = $('#notesRow');
    notesRow.fadeOut(0);
    notesRow.empty();

    for(let note of jsonResponse.results){
        notesRow.append(`
            <div class="col-12">
                <div class="note mb-3 d-flex flex-column justify-content-between" title="Criado por: ${note.name}">
                    <div class="note-content">${note.description}</div>
                    <div class="mt-3 d-flex justify-content-between aling-items-center">
                        <small> ${note.name} - ${formatDateTime(note.createdAt)}</small>
                        <button data-id="${note.idNote}" data-deletar-note title="Deletar anotação" type="button" class="btn btn-danger btn-sm">
                            <i class="fa fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `);
    }
    notesRow.fadeIn();

}
function templateOS(dados){
    const {dataEmissao,dataValidade, codReferencia, nome, telefone, descricao, valor, valorTotal, values, services} = dados;

    let servicesExibir = '';

    for(let campo of services){
        servicesExibir += `
            <tr>
                <td>
                    ${campo.desc}
                </td>
                <td style="text-align:end;white-space:nowrap">
                    ${campo.price != null ? 'R$ ' + parseFloat(campo.price).toLocaleString('pt-br',{minimumFractionDigits: 2}) : '--'}
                </td>
            </tr>
            <tr>
                <td colspan="2">
                    <div class="divisor"></div>
                </td>
            </tr>
        `;
    }

    ///////////////

    let camposExibir = '';

    for(let campo of campos){
        if(campo.searchable == 1 && values[campo.key]){
            camposExibir += `
             <p><strong>${campo.label}:</strong> ${values[campo.key]}</p>
            `;
        }
    }

    let htmlValidade = dataValidade != null ? `<p><strong>Validade:</strong> ${dataValidade}</p>` : '';

    return `
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ordem de Serviço</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 20px;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ccc;
            background-color: #f9f9f9;
        }
        h1 {
            margin-bottom:5px;
        }
        .detalhes{
            margin-bottom:2px;
            text-align:center;
        }
        .divisor{
            padding-bottom: 10px;
            width:100%;
            heigth:10px;
            border-bottom: 2px solid #333;
            margin-bottom:30px;
        }
        .info {
            margin-bottom: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        table *{
            border:none;
        }
        th, td {
            /*border: 1px solid #ccc;*/
            padding: 8px;
            text-align: left;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
        }
            .img{
            width:100%;
            display:flex;
            justify-content:center;
            }
            .img img{
                height: 80px;
            }
    </style>
</head>
<body>
    <div class="container">
        <div class="img">
            <img  src="${baseAdminUrl}img/logo.png" />
        </div>
        <div class="detalhes">
            <p> Ferreira - Manutenção em ar condicionado automotivo </p>
            <p> (51) 99885-7080 </p>
        </div>
        <h1>Ordem de Serviço</h1>
        

        <div class="divisor"></div>

        <div style="display: flex; justify-content: space-between;">
            <div class="info">
                <p><strong>Data de emissão:</strong> ${dataEmissao}</p>
                <p><strong>Cód. Referência:</strong> ${codReferencia}</p>
                ${htmlValidade}
                ${camposExibir}
            </div>

            <div class="info" style="text-align: end;">
                    <p><strong>Nome:</strong> ${nome}</p>
                    <p><strong>Contato:</strong> ${telefone}</p>
                </div>
        </div>
        
        <h2>Detalhes do Serviço</h2>
        <td>${descricao}</td>

        <table>
            <tbody>
            ${servicesExibir}
            </tbody>
        </table>

        <div class="info" style="display: flex; justify-content: space-between; margin-top:10px;">
            <h3><strong>Total:</strong></h3>
            <h3 style="color:green;"><strong>${valorTotal}</strong></h3>
        </div>
        <div class="info" style="display: flex; justify-content: space-between; margin-top:20px;">
            ${htmlValidade}
        </div>
        <script>
            print();
        </script>
    </div>
</body>
</html>


    `;
}