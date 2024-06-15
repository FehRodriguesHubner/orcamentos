const pageSlug = 'orcamentos';
const pageName = 'Orçamentos';
const campos = [
    {label:'Descrição do problema (Visível ao cliente na O.S)', key: 'description'},
    {label:'Detalhamento de serviço (NÃO visível ao cliente na O.S)', key: 'instructions'},
    {label:'Valor do orçamento', key: 'price'},

    {label:'Nome do Cliente', key: 'name'},
    {label:'Telefone do Cliente', key: 'phone'}
];

window.addEventListener('DOMContentLoaded', async function () {
    renderUserDataReplace();
    renderHeaderPath([{
        label: '<i class="fa-solid fa-house"></i> ' + pageName,
        link: null
    }]);
    renderPageActive(pageSlug);
    ///////////////////////////

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
            history.back();
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

    
    
    for(let campo of campos){
        // adiciona campo
        switch(campo.key){
            case 'description':
            case 'instructions':
                $('#inputs-row').append(`
                    <div class="col-12">
                        <div class="input-group mb-3">
                            <label for="input-${campo.key}">${campo.label}</label>
                            <div class="w-100">
                                <div class="input-container">
                                    <textarea maxlength="500" id="input-${campo.key}" type="text" class="input-default"></textarea>
                                    <small class="input-message"></small>
                                </div>
                            </div>
                        </div>
                    </div>
                `);
                break;
            default:
                $('#inputs-row').append(`
                    <div class="col-12">
                        <div class="input-group mb-3">
                            <label for="input-${campo.key}">${campo.label}</label>
                            <div class="w-100">
                                <div class="input-container">
                                    <input maxlength="50" id="input-${campo.key}" type="text" class="input-default">
                                    <small class="input-message"></small>
                                </div>
                            </div>
                        </div>
                    </div>
                `);
                break;
        }

        // define valor do campo
        switch(campo.key){
            case 'price':
                $(`#input-${campo.key}`).val(parseFloat(result[campo.key]).toLocaleString('pt-br',{minimumFractionDigits: 2}));
                break;
            default:
                $(`#input-${campo.key}`).val(result[campo.key]);
                break;
        }
        
    }

    // MÁSCARAS
    $('#input-phone')
        .attr('data-mask',"phone")
        .attr('disabled',"true")
        .attr('data-type','phone')
        .attr('data-optional','true')
        .addClass('disabled','true');
        
    $('#input-name')
        .attr('disabled',"true")
        .attr('data-optional','true')
        .addClass('disabled','true');
        
    $('#input-instructions').attr('data-optional','true');    
    
    $('#input-price')
    .attr('data-mask',"money")
    .attr('data-optional','true');

    maskInputs();

    $('[id^="input-"]').each(function(){
        if($(this).attr('data-optional') != 'true'){
            const inputGroup = $(this).closest('.input-group');

            const label = inputGroup.find(' > label');

            if(label.attr('data-required') == 'true') return;

            label.attr('data-required',true);
            label.html(`<b>${label.text()}*</b>`); 
        }
    });
    
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
