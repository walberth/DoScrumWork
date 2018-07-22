var daterangepicker, startDate, endDate, formatDate = 'DD/MM/YYYY';

function buildDatesComponent(element, parent) {
    console.log();
    daterangepicker = element.daterangepicker({
        'opens': 'left',
        'locale': {
            'format': formatDate,
            'cancelLabel': 'Cancelar',
            'applyLabel': 'Aplicar',
            'fromLabel': 'Desde',
            'toLabel': 'A',
            'daysOfWeek': ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
            'monthNames': ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre',
                'Octubre', 'Noviembre', 'Diciembre']
        },
        'initEmpty': false,
        //'parentEl': parent
    }, function(start, end) {
        startDate = start.format(formatDate);
        endDate = end.format(formatDate);
    });
    element.val("");
    /*element.on('apply.daterangepicker', function(ev, picker) {
        console.log({'startDate': startDate, 'endDate': endDate});
    });*/
}

function getDateParameters(){
    return {'startDate': startDate, 'endDate': endDate};
}
