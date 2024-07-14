const pageSlug = 'campos-orcamento';
const pageName = 'Campos Orçamento';
const campos = [
    {label:'Rótulo do campo', key: 'label', placeholder:'Ex.: Número da sorte'},
    {label:'Formatação/Validação do campo', key: 'type', type: FIELD_TYPE_SELECT, content: [
        {label:'Padrão (texto)',value:''},
        {label:'Número',value:'number'},
        {label:'Telefone',value:'telefone'},
        {label:'E-mail',value:'email'},
        {label:'CPF',value:'cpf'},
        {label:'CNPJ',value:'cnpj'},
        {label:'RG',value:'rg'},
        {label:'Data',value:'date'},
        {label:'CEP',value:'cep'},
        {label:'Dinheiro',value:'money'},
        {label:'Placa de Carro',value:'placaCarro'}
    ], required:false},
    {label:'Obrigatório', key: 'required', type: FIELD_TYPE_RADIO},
    {label:'Pesquisável', key: 'searchable', type: FIELD_TYPE_RADIO},
    {label:'Editável', key: 'editable', type: FIELD_TYPE_RADIO},

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
            
            if(campo.type === FIELD_TYPE_RADIO){
                jsonCampos[campo.key] = $(`[name="input-${campo.key}"]:checked`).val().trim();
            }else{
                jsonCampos[campo.key] = element.val().trim();
            }

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
        renderInput(campo,result);
    }

    maskInputs();

    renderRequired();
    
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
