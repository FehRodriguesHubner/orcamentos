const pageSlug = 'orcamentos';
const pageName = 'Orçamentos';
const campos = [
    {label:'Abertura', key: 'createdAt'},
    {label:'Nome do Cliente', key: 'name'},
    {label:'Telefone do Cliente', key: 'phone'},
    {label:'Descrição', key: 'description'},
    {label:'Valor', key: 'price'}
];

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

    campos.push({label:'Ações', key: 'actions'});
    renderDefault();

});

function fetchDefault() {
    return new Promise(async function (res, rej) {
        let fetchResponse = await fetch(`${apiUrl}/${pageSlug}/list.php`, {
            method: 'GET'
        });

        let fetchJsonResponse;

        if (fetchResponse.status == 401) {window.location.href = baseAdminUrl;return;}
        if (fetchResponse.status != 200) {
            dispatchPopup(
                'error',
                'Ops!',
                'Ocorreu um erro ao buscar as informações necessárias. Por favor, atualize a página ou volte novamente mais tarde'
            );

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
            );

            rej(false);
            return;
        }

        res(fetchJsonResponse);

    });
}
function fetchDefaultDelete(id) {
    return new Promise(async function (res, rej) {
        let fetchResponse = await fetch(`${apiUrl}/${pageSlug}/delete.php?id=${id}`, {
            method: 'DELETE'
        });

        let fetchJsonResponse;

        if (fetchResponse.status == 401) {window.location.href = baseAdminUrl;return;}
        if (fetchResponse.status == 403) {
            dispatchPopup(
                'warning',
                'Exclusão indevida!',
                'Certifique-se de excluir primeiro seus dependentes'
            );

            rej(false);

            return;
        }
        if (fetchResponse.status != 200) {
            dispatchPopup(
                'error',
                'Ops!',
                'Ocorreu um erro ao efetuar a exclusão. Por favor, atualize a página ou volte novamente mais tarde'
            );

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
            );

            rej(false);
            return;
        }

        res(fetchJsonResponse);

    });
}

$(function(){
    $(document).on('click','[data-action="delete"]', async function(){
        let id = $(this).attr('data-id');
        dispatchPopup('warning','Atenção','Tem certeza que deseja arquivar este orçamento/serviço?',{showCancelButton:true,cancelButtonText:'Cancelar'}).then(async function(swalRes){
            if(!swalRes.isConfirmed) return;
            popupLoading();
    
            try{
                await fetchDefaultDelete(id);
            }catch(e){
                console.log('delete falhou:',id)
                return;
            }
    
            renderDefault();

        })

    });
    $(document).on('click','[data-action="open"]', async function(){
        let id = $(this).attr('data-id');
        dispatchPopup('warning','Atenção','Tem certeza que deseja reabrir este orçamento?',{showCancelButton:true,cancelButtonText:'Cancelar'}).then(async function(swalRes){
            console.log(swalRes.isConfirmed);
            if(!swalRes.isConfirmed) return;
            popupLoading();
            console.log(id);
            try{
                jsonResponse = await fetchReq(`orcamentos/open.php`,{
                    "id": id
                });
            }catch(except){ console.log(except); return;}
    
            renderDefault();
            Swal.close();
        });

    });
    $(document).on('click','[data-action="aprove"]', async function(){
        let id = $(this).attr('data-id');
        dispatchPopup('warning','Atenção','Tem certeza que deseja aprovar este orçamento?',{showCancelButton:true,cancelButtonText:'Cancelar'}).then(async function(swalRes){
            console.log(swalRes.isConfirmed);
            if(!swalRes.isConfirmed) return;
            popupLoading();
            console.log(id);
            try{
                jsonResponse = await fetchReq(`orcamentos/aprove.php`,{
                    "id": id
                });
            }catch(except){ console.log(except); return;}
    
            renderDefault();
            Swal.close();
        });

    });
    $(document).on('click','[data-action="close"]', async function(){
        let id = $(this).attr('data-id');
        dispatchPopup('warning','Atenção','Tem certeza que deseja encerrar este serviço?',{showCancelButton:true,cancelButtonText:'Cancelar'}).then(async function(swalRes){
            console.log(swalRes.isConfirmed);
            if(!swalRes.isConfirmed) return;
            popupLoading();
            console.log(id);
            try{
                jsonResponse = await fetchReq(`orcamentos/close.php`,{
                    "id": id
                });
            }catch(except){ console.log(except); return;}
    
            renderDefault();
            Swal.close();
        });

    });
});

async function renderDefault(){
    return new Promise(async function(res,rej){
        const dataTablesWrapper = document.querySelector('#datatables-models');
    
        function montaHTMLTabela(campos){
            var strCampos = ``;
            for(let campo of campos){
                let strCampo = `<th data-key="${campo.key}">${campo.label}</th>`;
                strCampos += strCampo;
            }

            dataTablesWrapper.innerHTML = /*html*/ `
                <table class="table table-striped" width="100%">
                    <thead>
                        <tr>
                           ${strCampos}
                        </tr>
                    </thead>
                    <tbody></tbody>
                    <tfoot></tfoot>
                </table>
            `;
        }

        montaHTMLTabela(campos);
    
    
        $('#datatables-models table').DataTable({
            responsive: true,
            scrollX:true,
            language: {
                url: `${baseAdminUrl}/libs/jquery-datatable/locale/dataTables.pt_br.json`
            },
            dom: 'Bfrtip',
            buttons: [
                {
                    extend: 'pdfHtml5',
                    orientation: 'landscape',
                    pageSize: 'a3',
                    text: `<i class="fa fa-download"></i>
                    &nbsp
                    Download PDF `,
                    className: 'btn-warning fw-bold'
                }
            ],
            columns: campos.map(campo => ({
                data: campo.key,
                render: function (data, type, row) {
                    let field = '--';
                    switch(campo.key) {
                        case 'price':
                            sortValue = 0;
                            if (row[campo.key] != null) {
                                sortValue = row[campo.key];
                                field = `R$ ${parseFloat(row[campo.key]).toLocaleString('pt-br', { minimumFractionDigits: 2 })}`;
                            }
                            break;
                        case 'createdAt':
                            if (row[campo.key] != null) {
                                sortValue = row[campo.key];
                                field = formatDateTime(row[campo.key]);
                            }
                            break;
                        case 'actions':
                            const btnOpen = `
                                <button data-action="open" title="Reabrir" data-id="${row.idQuote}" class="btn btn-secondary d-flex justify-content-between align-items-center me-2">
                                    <i class="fa fa-box-archive"></i>
                                </button>`;
                            const btnDelete = `
                                <button data-action="delete" title="Deletar" data-id="${row.idQuote}" class="btn btn-danger d-flex justify-content-between align-items-center me-2">
                                    <i class="fa fa-box-archive"></i>
                                </button>`;
                            const btnAprove = `
                                <button data-action="aprove" title="Aprovar" data-id="${row.idQuote}" class="btn btn-warning d-flex justify-content-between align-items-center me-2">
                                    <i class="fa fa-dollar"></i>
                                </button>`;
                            const btnClose = `
                                <button data-action="close" title="Concluír" data-id="${row.idQuote}" class="btn btn-success d-flex justify-content-between alinhamentos-center me-2">
                                    <i class="fa fa-check"></i>
                                </button>`;
                            field = `
                            <div class="d-flex justify-content-end">
                                ${row.status == 0 ? btnOpen : ''}
                                ${row.status != 0 ? btnDelete : ''}
                                ${row.status == 1 ? btnAprove : ''}
                                ${row.status == 2 ? btnClose : ''}
                                <a title="Editar" href="${baseAdminUrl}${pageSlug}/editar/${row.idQuote}" class="btn btn-info d-flex justify-content-between align-items-center me-2">
                                    <i class="fa fa-eye"></i>
                                </a>
                            </div>`;
                            break;
                        default:
                            if(row[campo.key] != null ) {
                                field = row[campo.key];
                            }else{
                                field = '--';
                            }
                            break;
                    }

                    return field;

                    if (campo.key === 'actions') {
                        // Renderizar as ações aqui
                        const btnOpen = `
                            <button data-action="open" title="Reabrir" data-id="${row.idQuote}" class="btn btn-secondary d-flex justify-content-between align-items-center me-2">
                                <i class="fa fa-box-archive"></i>
                            </button>`;
                        const btnDelete = `
                            <button data-action="delete" title="Deletar" data-id="${row.idQuote}" class="btn btn-danger d-flex justify-content-between align-items-center me-2">
                                <i class="fa fa-box-archive"></i>
                            </button>`;
                        const btnAprove = `
                            <button data-action="aprove" title="Aprovar" data-id="${row.idQuote}" class="btn btn-warning d-flex justify-content-between align-items-center me-2">
                                <i class="fa fa-dollar"></i>
                            </button>`;
                        const btnClose = `
                            <button data-action="close" title="Concluír" data-id="${row.idQuote}" class="btn btn-success d-flex justify-content-between align-items-center me-2">
                                <i class="fa fa-check"></i>
                            </button>`;
        
                        return `
                        <div class="d-flex justify-content-end">
                            ${row.status == 0 ? btnOpen : ''}
                            ${row.status != 0 ? btnDelete : ''}
                            ${row.status == 1 ? btnAprove : ''}
                            ${row.status == 2 ? btnClose : ''}
                            <a title="Editar" href="${baseAdminUrl}${pageSlug}/editar/${row.idQuote}" class="btn btn-info d-flex justify-content-between align-items-center me-2">
                                <i class="fa fa-eye"></i>
                            </a>
                        </div>`;
                    }
                    return data;
                }
            })),
            createdRow: function (row, data, dataIndex) {
                let trClass = '';
                switch (parseInt(data.status)) {
                    case 0:
                        trClass = 'table-danger';
                        break;
                    case 1:
                        trClass = '';
                        break;
                    case 2:
                        trClass = 'table-warning';
                        break;
                    case 3:
                        trClass = 'table-success';
                        break;
                }
                $(row).addClass(trClass);
            },
            ajax: {
                url: `${apiUrl}/${pageSlug}/list.php`, // URL do endpoint da sua API
                type: 'POST', // Tipo de requisição (pode ser GET ou POST)
                dataSrc: function (json) {
                    return json.data; // Certifique-se de que os dados estão sendo retornados corretamente
                }
            },
            serverSide: true, // Ativar paginação via backend
        });
    

        res(true);

        Swal.close();

    });

}



