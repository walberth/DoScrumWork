var sResponsibleTaskValid = true, 
    incrementalAuxUserStories = 0, 
    select2Val = {'id': null, 'text': null},
    RESOURCES = {
        'select2': "Seleccione",
        'modal': {
            'create': {
                'title': "Crear Historia de Usuario", 'button': "Crear", 'action': "create"
            },
            'view': {
                'title': "Detalle Historia de Usuario", 'button': null, 'action': "view"
            }
        }
    },
    COLORS = ['#00a65a', '#f39c12', '#00c0ef', '#3c8dbc', '#dd4b39', '#b32d00', '#ff8c1a', '#99cc00', '#9900cc', '#663300'],
    colorsIncrementalAux = 0, 
    colorsTotalAux = COLORS.length - 1, 
    dataResponsibles = [], 
    userStories = {},
    itemUserStoryAux = {}, 
    $select, 
    data, 
    idProject, 
    incrementalAuxSprints = 0, 
    colorsIncrementalAuxTask = 0,
	sprintCreated = true, 
    styleSprint, 
    usTasks = {}, 
    idDragEventUS, 
    colorsIncrementalAuxPreTask = 0,
	taskStatus = {
		'TODO': "to_do", 'INPROGRESS': "in_progress", 'DONE': "done"
	},
	incrementalAuxTask = 0,
    listProjects = {}, 
    tMainReport = [], 
    tMainReportUS = {}, 
    tMainReportSprint = {}, 
    gMainReport = {},
    templateColumnStyle = '<a id="{{idModal}}" href="#" class="table-row-special" data-idproj="{{idProject}}"><span>{{name}}</span></a>',
    tProjectMainReport, 
    tProjectUserStories, 
    tProjectSprints, 
    gProjectMainReport, 
    listProjectsSelect = [],
    $select, 
    gDetailReportProjectSprints = {}, 
    chartDetailReportProjectSprints,
    dataCategoriesSprints = {},
    dataSeriesSprints = {}, 
    gProjectDetailUSReport, 
    idCurrentProject,
    gDetailReportProjectSprintsPie = {}, 
    gProjectDetailUSReportPie,
    dataStatistic;

if(typeof XLSX == 'undefined') XLSX = require('xlsx');

function initializeStadistics(){
    activeNavHeader();
    initializeEventsModals();
    getAllData();
}

function activeNavHeader(){
    $('#liStatistics').addClass("active");
}

function initializeEventsModals(){
    $("#userStoriesModal").on('show.bs.modal', function () {
        $('#userStoriesModalBody').append(buildContainerOverlay());
    });
    $("#sprintsModal").on('show.bs.modal', function () {
        $('#sprintsModalBody').append(buildContainerOverlay());
    });
}

function getAllData() {
    //$.ajax({
    //    url: '/Stadistics/GetAllData',
    //    type: 'POST'
    //}).done(function(e) {
    //    dataSprintBoard = e;
    //    prepareData();
    //    renderReport();
    //});
    $.ajax({
        'url': '/Stadistics/GetAllData',
        'contentType': "application/json",
        'dataType': "json",
        'type': "GET",
        'cache': true,
        'async': true
    }).done(function(e) {
        console.log(e);
        dataStatistic = e;
        prepareData();
        renderReport();
    }).fail(function(jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
    });
}

function prepareData(){
    var data = dataStatistic.data, iData, node, idProject, nameProject, startDateProject, endDateProject,
        quantityUS = 0, quantitySprint = 0, seriesProject = [], dataSerieProjectUS = [],
        dataSerieProjectSprint = [], dataCategoriesProjects = [], gDetailReportProjectSprintsItem,
        userStories, iUserStory, userStory, userStoriesProject, sprints, iSprint, sprint, sprintsProject,
        dataProjectCategoriesSprints, objSprintsProject = {}, quantityWithoutAssigned, iObjSprintsProject,
        nodeObjSprintsProject, seriesSprintsProject;
    for(iData in data){
        node = data[iData];
        idProject = node.uid;
        nameProject = node.name;
        startDateProject = node.startDate;
        endDateProject = node.endDate;
        listProjects[idProject] = nameProject;
        listProjectsSelect.push({
            'id': idProject, 'text': nameProject
        });
        quantityUS = node.userStories.length;
        quantitySprint = node.sprints.length;
        tMainReport.push({
            'idProject': idProject, 'nameProject': nameProject,
            'quantityUS': quantityUS, 'quantitySprint': quantitySprint
        });
        userStories = node.userStories;
        sprints = node.sprints;
        sprintsProject = [];
        dataProjectCategoriesSprints = [];
        quantityWithoutAssigned = 0;
        objSprintsProject = {};
        for(iSprint in sprints){
            sprint = sprints[iSprint];
            sprintsProject.push({
                'sprint': sprint.name, 'stories': sprint.stories.length,
                'tasks': sprint.tasks.length
            });
            objSprintsProject[sprint.uid] = {'name': sprint.name, 'quantity': 0};
            dataProjectCategoriesSprints.push(sprint.name);
        }
        tMainReportSprint[idProject] = sprintsProject;
        userStoriesProject = [];
        for(iUserStory in userStories){
            userStory = userStories[iUserStory];
            userStoriesProject.push({
                'userStory': userStory.name, 'responsible': userStory.userResponsable,
                'effort': userStory.effort, 'priority': userStory.priority,
                'tasks': userStory.tasks.length
            });
            if(userStory.idSprint !== null){
                objSprintsProject[userStory.idSprint].quantity++;
            } else {
                quantityWithoutAssigned++;
            }
        }
        tMainReportUS[idProject] = userStoriesProject;
        //
        gMainReport.title = "Vista general de proyectos";
        dataCategoriesProjects.push(nameProject);
        gMainReport.yAxis = "Cantidad";
        dataSerieProjectUS.push(quantityUS);
        dataSerieProjectSprint.push(quantitySprint);
        dataCategoriesProjects.push(nameProject);
        //
        seriesSprintsProject = [];
        gDetailReportProjectSprintsPie[idProject] = [];
        for(iObjSprintsProject in objSprintsProject){
            nodeObjSprintsProject = objSprintsProject[iObjSprintsProject];
            seriesSprintsProject.push(nodeObjSprintsProject.quantity);
            gDetailReportProjectSprintsPie[idProject].push({
                'name': nodeObjSprintsProject.name, 'y': nodeObjSprintsProject.quantity
            });
        }
        seriesSprintsProject.push(quantityWithoutAssigned);
        dataProjectCategoriesSprints.push("Sin asignar");
        gDetailReportProjectSprintsPie[idProject].push({
            'name': "Sin asignar", 'y': quantityWithoutAssigned
        });
        dataCategoriesSprints[idProject] = dataProjectCategoriesSprints;
        dataSeriesSprints[idProject] = seriesSprintsProject;
        console.log(dataProjectCategoriesSprints);
        gDetailReportProjectSprints[idProject] = {
            'title': "Asignación de historias de usuario", 'yAxis': "Cantidad",
            'xAxis': dataProjectCategoriesSprints, 'series': seriesSprintsProject
        };
    }
    gMainReport.xAxis = dataCategoriesProjects;
    seriesProject.push({
        'name': "Historias de Usuario", 'data': dataSerieProjectUS
    });
    seriesProject.push({
        'name': "Sprints", 'data': dataSerieProjectSprint
    });
    gMainReport.series = seriesProject;
    $select = $('#sListProjects').select2({
        'theme': 'bootstrap', 'placeholder': RESOURCES.select2, 'language': 'es',
        'minimumResultsForSearch': Infinity, 'data': listProjectsSelect,
        'dropdownParent': $('#containerSListProjects')
    });
    $select.on('change', function(e) {
        var id = $(this).val();
        renderChartDetailSprintsUS(id);
    });
}

function renderReport(){
    renderTableMainReport();
    renderChartMainReport();
    renderChartDetailSprintsUS($select.val());
}

function renderTableMainReport(){
    tProjectMainReport = $('#tMainReport').DataTable({
        'data': tMainReport, 'oLanguage': getLanguageTable(),
        'columns': [
            {'data': "idProject", 'className': "column-custom", 'width': "0%", 'visible': false, 'orderable': false},
            {'data': "nameProject", 'className': "column-custom", 'width': "50%"},
            {'data': "quantityUS", 'className': "column-custom", 'width': "25%"},
            {'data': "quantitySprint", 'className': "column-custom", 'width': "25%"}
        ],
        'searching': false, 'ordering': true, 'paging': true, 'lengthChange': false,
        'info': true, 'autoWidth': true, 'pageLength': 5, 'scrollX': true, 'order': [0, 'asc'],
        'columnDefs': [
            {
                'targets': 2,
                'render': function(data, type, row, meta) {
                    var structure = templateColumnStyle, idProject, name, idModal = "modalUS";
                    if(data > 0){
                        idProject = row.idProject;
                        name = data;
                        return structure.replace("{{idModal}}", idModal)
                                        .replace("{{idProject}}", idProject)
                                        .replace("{{name}}", name);
                    }
                    return data;
                }
            },
            {
                'targets': 3,
                'render': function(data, type, row, meta) {
                    var structure = templateColumnStyle, idProject, name, idModal = "modalSprint";
                    if(data > 0){
                        idProject = row.idProject;
                        name = data;
                        return structure.replace("{{idModal}}", idModal)
                                        .replace("{{idProject}}", idProject)
                                        .replace("{{name}}", name);
                    }
                    return data;
                }
            }
        ]
    });
    $(document).on('click', '#modalUS', function(){
        var $this = $(this), idProject = $this.attr('data-idproj');
        $('#nameProjectUsTitle').text(listProjects[idProject]);
        renderDetailTableUS(idProject);
        $("#userStoriesModal").modal("show");
        $("#userStoriesModal").on('shown.bs.modal', function () {
            tProjectUserStories.columns.adjust().draw();
            $('.overlay').remove();
        });
    });
    $(document).on('click', '#modalSprint', function(){
        var $this = $(this), idProject = $this.attr('data-idproj');
        $('#nameProjectSprintTitle').text(listProjects[idProject]);
        renderDetailTableSprint(idProject);
        $("#sprintsModal").modal("show");
        $("#sprintsModal").on('shown.bs.modal', function () {
            tProjectSprints.columns.adjust().draw();
            $('.overlay').remove();
        });
    });
    $('#btnExportMainReport').on('click', function(){
        var ws = XLSX.utils.json_to_sheet(tMainReport);
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Informacion de proyectos");
        var wbout = XLSX.write(wb, {bookType:'xlsx', type:'binary'});
        function s2ab(s) {
        	var buf = new ArrayBuffer(s.length);
        	var view = new Uint8Array(buf);
        	for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        	return buf;
        }
        saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), "Informacion de proyectos.xlsx");
    });
}

function renderChartMainReport(){
    gProjectMainReport = Highcharts.chart('gMainReport', {
        'chart': {
            'type': 'column',
            'reflow': true
        },
        'title': {
            'text': gMainReport.title
        },
        'tooltip': {
            'valueSuffix': " ", 'shared': true, 'enabled': true
        },
        'xAxis': {
            'categories': gMainReport.xAxis
        },
        'yAxis': [{
            'max': null, 'min': 0, 'opposite': false, 'reversedStacks': true,
            'title': {
                'text': gMainReport.yAxis
            }
        }],
        'series': gMainReport.series,
        'exporting': {
            'buttons': {
                'contextButton': {
                    'menuItems': ['downloadPNG', 'downloadJPEG', 'downloadCSV', 'downloadXLS', 'downloadPDF']
                }
            }
        }
    });
}

function renderChartDetailSprintsUS(id){
    var data = gDetailReportProjectSprints[id];
    if(typeof gProjectDetailUSReport !== 'undefined' && gProjectDetailUSReport !== null){
        while (gProjectDetailUSReport['series'].length > 0) {
            gProjectDetailUSReport.series[0].remove(false);
        }
        gProjectDetailUSReport.addSeries({
            'name': "Historias de Usuario", 'data': data.series
        }, false);
        gProjectDetailUSReport.xAxis[0].setCategories(data.xAxis, false);
        gProjectDetailUSReport.redraw();
        reAnimate(true, gProjectDetailUSReport);
    } else {
        gProjectDetailUSReport = Highcharts.chart('gDetailReportProjectSprints', {
            'chart': {
                'type': 'column',
                'reflow': true
            },
            'title': {
                'text': "Historias de usuario por Sprint"
            },
            'tooltip': {
                'valueSuffix': " ", 'shared': true, 'enabled': true
            },
            'xAxis': {
                'categories': data.xAxis
            },
            'yAxis': [{
                'max': null, 'min': 0, 'opposite': false, 'reversedStacks': true,
                'title': {
                    'text': data.yAxis
                }
            }],
            'series': [{
                'name': "Historias de Usuario", 'data': data.series
            }],
            'legend': {
                'enabled': false
            },
            'exporting': {
                'buttons': {
                    'contextButton': {
                        'menuItems': ['downloadPNG', 'downloadJPEG', 'downloadCSV', 'downloadXLS', 'downloadPDF']
                    }
                }
            }
        });
    }
    var dataPie = gDetailReportProjectSprintsPie[id];
    if(typeof gProjectDetailUSReportPie !== 'undefined' && gProjectDetailUSReportPie !== null){
        gProjectDetailUSReportPie.series[0].setData(dataPie, true);
        reAnimate(true, gProjectDetailUSReportPie);
    } else {
        gProjectDetailUSReportPie = Highcharts.chart('gDetailReportProjectSprintsPie', {
            'chart': {
                'type': 'pie',
                'reflow': true
            },
            'title': {
                'text': "Historias de usuario"
            },
            'tooltip': {
                'valueSuffix': " ", 'shared': true, 'enabled': true
            },
            'series': [{
                'name': "Historias de Usuario", 'data': dataPie
            }],
            'plotOptions': {
               'pie': {
                   'allowPointSelect': true,
                   'cursor': 'pointer',
                   'dataLabels': {
                       'distance': -50,
                       'format': '<b>{point.percentage:.2f}%</b>'
                   },
                   'showInLegend': true
               }
            },
            'exporting': {
                'buttons': {
                    'contextButton': {
                        'menuItems': ['downloadPNG', 'downloadJPEG', 'downloadCSV', 'downloadXLS', 'downloadPDF']
                    }
                }
            }
        });
    }
}

function renderDetailTableUS(idProject){
    if ($.fn.DataTable.isDataTable('#tProjectUserStories')){
        tProjectUserStories.clear();
        tProjectUserStories.rows.add(tMainReportUS[idProject]);
        tProjectUserStories.draw();
    } else {
        tProjectUserStories = $('#tProjectUserStories').DataTable({
            'data': tMainReportUS[idProject], 'oLanguage': getLanguageTable(),
            'columns': [
                {'data': "userStory", 'className': "column-custom", 'width': "35%"},
                {'data': "responsible", 'className': "column-custom", 'width': "20%"},
                {'data': "effort", 'className': "column-custom", 'width': "15%"},
                {'data': "priority", 'className': "column-custom", 'width': "15%"},
                {'data': "tasks", 'className': "column-custom", 'width': "15%"}
            ],
            'searching': false, 'ordering': true, 'paging': true, 'lengthChange': false,
            'info': true, 'autoWidth': true, 'pageLength': 8, 'scrollX': true, 'order': [0, 'asc']
        });
    }
    $('#btnExportUSProject').off('click');
    $('#btnExportUSProject').on('click', function(){
        var ws = XLSX.utils.json_to_sheet(tMainReportUS[idProject]);
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Historias de usuario");
        var wbout = XLSX.write(wb, {bookType:'xlsx', type:'binary'});
        function s2ab(s) {
        	var buf = new ArrayBuffer(s.length);
        	var view = new Uint8Array(buf);
        	for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        	return buf;
        }
        saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), "Historias de usuario.xlsx");
    });
}

function renderDetailTableSprint(idProject){
    if ($.fn.DataTable.isDataTable('#tProjectSprints')){
        tProjectSprints.clear();
        tProjectSprints.rows.add(tMainReportSprint[idProject]);
        tProjectSprints.draw();
    } else {
        tProjectSprints = $('#tProjectSprints').DataTable({
            'data': tMainReportSprint[idProject], 'oLanguage': getLanguageTable(),
            'columns': [
                {'data': "sprint", 'className': "column-custom", 'width': "50%"},
                {'data': "stories", 'className': "column-custom", 'width': "25%"},
                {'data': "tasks", 'className': "column-custom", 'width': "25%"}
            ],
            'searching': false, 'ordering': true, 'paging': true, 'lengthChange': false,
            'info': true, 'autoWidth': true, 'pageLength': 8, 'scrollX': true, 'order': [0, 'asc']
        });
    }
    $('#btnExportSprintProject').off('click');
    $('#btnExportSprintProject').on('click', function(){
        var ws = XLSX.utils.json_to_sheet(tMainReportSprint[idProject]);
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Informacion de sprints");
        var wbout = XLSX.write(wb, {bookType:'xlsx', type:'binary'});
        function s2ab(s) {
        	var buf = new ArrayBuffer(s.length);
        	var view = new Uint8Array(buf);
        	for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        	return buf;
        }
        saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), "Informacion de sprints.xlsx");
    });
}

function buildContainerOverlay(){
    var context = {}, nodes = [], project, iProject,
        source = document.getElementById("temp-overlay-container").innerHTML,
        template = Handlebars.compile(source);
    return template(context);
}

function getLanguageTable(){
    return {
    	"sProcessing":     "Procesando...",
    	"sLengthMenu":     "Mostrar _MENU_ registros",
    	"sZeroRecords":    "No se encontraron resultados",
    	"sEmptyTable":     "Ningún dato disponible en esta tabla",
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
