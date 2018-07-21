/* 
 * version: 2.0
 */

function datatableTextSpanish(){
    return {
            "sProcessing":     "Procesando...",
            "sLengthMenu":     "Mostrar _MENU_ registros",
            "sZeroRecords":    "No se encontraron resultados",
            "sEmptyTable":     "Ning&uacute;n dato disponible en esta tabla",
            "sInfo":           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            "sInfoEmpty":      "Mostrando registros del 0 al 0 de un total de 0 registros",
            "sInfoFiltered":   "(filtrado de un total de _MAX_ registros)",
            "sInfoPostFix":    "",
            "sSearch":         "Buscar:",
            "sUrl":            "",
            "sInfoThousands":  ",",
            "sLoadingRecords": "Cargando...",           
            "oPaginate": {
                "sFirst":    "Primero",
                "sLast":     "Último",
                "sNext":     "Siguiente",
                "sPrevious": "Anterior"
            },
            "oAria": {
                "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            }
        };   
}



$.fn.dataTableExt.oApi.fnResetAllFilters = function (oSettings, bDraw/*default true*/) {
    for(iCol = 0; iCol < oSettings.aoPreSearchCols.length; iCol++) {
        oSettings.aoPreSearchCols[ iCol ].sSearch = '';
    }
    oSettings.oPreviousSearch.sSearch = '';

    if(typeof bDraw === 'undefined') bDraw = true;
    if(bDraw) this.fnDraw();
};