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
    //

    renderDefaultForm();

});

$(function(){
    // submit
    $('#form-create').on('submit',async function(ev){
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

        let fetchResponse = await fetch(`${apiUrl}/${pageSlug}/create.php`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body:JSON.stringify(jsonCampos)
        });

        //////////

        let fetchJsonResponse = null;
        try{
            fetchJsonResponse = await fetchResponse.json();
        }catch(ex){
            fetchJsonResponse = null;
        }

        if(fetchResponse.status != 200){
            if(fetchJsonResponse?.message != null){
                dispatchPopup('error','Ops! ocorreu um erro.',fetchJsonResponse?.message);   
            }else{
                dispatchPopup('error','Ops! ocorreu um erro.','Não foi possível concluír a operação. Por favor, tente novamente mais tarde.');
            }

            return false;
        }else{
            if(fetchJsonResponse?.message != null){
                dispatchPopup('success','Pronto!',fetchJsonResponse?.message).then(function(){
                    history.back();
                });
                return;
            }
            dispatchPopup('success','Pronto!','Cadastro realizado com sucesso.').then(function(){
                history.back();
            });
        }
        //////////

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
        
    for(let campo of campos){
        // adiciona campo
        
        renderInput(campo);
    }

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
