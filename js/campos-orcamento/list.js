const pageSlug = 'campos-orcamento';
const pageName = 'Campos Orçamento';
const campos = [
    {label:'Rótulo do campo', key: 'label', placeholder:'Ex.: Número da sorte'},

    {label:'Criado em', key: 'createdAt'},
    {label:'Ações', key: 'actions'}
];
window.addEventListener('DOMContentLoaded', async function () {
    renderUserDataReplace();
    renderHeaderPath([{
        label: '<i class="fa-solid fa-house"></i> ' + pageName,
        link: null
    }]);
    renderPageActive(pageSlug);
    ///////////////////////////

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
        dispatchPopup('warning','Atenção','Tem certeza que deseja deletar este campo?',{showCancelButton:true,cancelButtonText:'Cancelar'}).then(async function(swalRes){
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
});

async function renderDefault(){
    return new Promise(async function(res,rej){
        const dataTablesWrapper = document.querySelector('#datatables-models');
        var result;
        try{
            result = await fetchDefault();
        }catch(e){
            res(false);
            return;
        }
        //// TRATAMENTO DOS DADOS ////

        dataTablesWrapper.innerHTML = '';

        let data = result.results;
        
        if( data == null || data.length < 1){
    
            dataTablesWrapper.classList.remove('card-profile', 'p-lg-4', 'p-md-3', 'p-2')
    
            dataTablesWrapper.innerHTML = /*html*/`
            <div class="d-flex flex-column">
                <p class="message-on-container mb-4">Nenhum registro até o momento.</p>     
            </div>
    
            `;
            res(false);
            Swal.close();
            
            return false;
    
        }
    
        function montaHTMLTabela(campos){
            var strCampos = ``;
            for(let campo of campos){
                let strCampo = `
                    <th> ${campo.label} </th>
                `;
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
    
        for(let index in data){
    
            let row = data[index];
            let strRow = '';
            let trClass = '';

            switch(parseInt(row['status'])){
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

            for(let campo of campos){
                let field = '--';
                let sortValue = null;

                // CUSTOM FIELDS //
                switch(campo.key){
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

                        const btnDelete = `
                            <button data-action="delete" title="Deletar" data-id="${row.idCustomField}" class="btn btn-danger d-flex justify-content-between align-items-center me-2">
                                <i class="fa fa-trash"></i>
                            </button>
                        `;

                        

                        field = `
                        <div class="d-flex justify-content-end">
                            ${row.status != 0 ? btnDelete   : ''}

                            <a title="Editar" href="${baseAdminUrl}${pageSlug}/editar/${row.idCustomField}" class="btn btn-secondary d-flex justify-content-between align-items-center me-2">
                                <i class="fa fa-edit"></i>
                            </a>     
                        </div>
                        
                        `;

                        break;
                    default:
                        if(row[campo.key] != null ){
                            field = row[campo.key];
                        }

                        break;
                }

                sortValue = sortValue == null ? '' : `data-order="${sortValue}"`;

                let strField = `
                    <td ${sortValue}>
                        <div>
                            ${field}
                        </div>
                    </td>`;
                strRow += strField;
            }

            dataTablesWrapper.querySelector('tbody').insertAdjacentHTML('beforeend',/*html*/ `
                <tr class="${trClass}">
                    ${strRow}
                </tr>
            `);
    
        }
    
    
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
            ]
        });
    

        res(true);

        Swal.close();

    });

}



