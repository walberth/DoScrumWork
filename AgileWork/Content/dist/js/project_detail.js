//var sResponsibleTaskValid = true, incrementalAuxUserStories = 0, select2Val = {'id': null, 'text': null},
//    RESOURCES = {
//        'select2': "Seleccione",
//        'modal': {
//            'create': {
//                'title': "Crear Historia de Usuario", 'button': "Crear", 'action': "create"
//            },
//            'view': {
//                'title': "Detalle Historia de Usuario", 'button': null, 'action': "view"
//            }
//        }
//    },
//    COLORS = ['#00a65a', '#f39c12', '#00c0ef', '#3c8dbc', '#dd4b39', '#b32d00', '#ff8c1a', '#99cc00',
//            '#9900cc', '#663300'],
//    colorsIncrementalAux = 0, colorsTotalAux = COLORS.length - 1, dataResponsibles = [], userStories = {},
//    itemUserStoryAux = {}, $select, data, idProject, incrementalAuxSprints = 0, colorsIncrementalAuxSprint = 0,
//	sprintCreated = true, styleSprint;

//function initialize(){
//    initializeEvents();
//	renderProjectDetail();
//    getAllResponsibles();
//}

//function initializeEvents(){
//    $("#btnCreateTask").click(function(){
//        $("#taskModal").modal("show");
//        $('#taskModalTitle').text(RESOURCES.modal.create.title);
//        $('#mActionTask').text(RESOURCES.modal.create.button);
//		$('#mUserStoryFooter').removeClass('hidden');
//        $('#mActionTask').attr('data-action', RESOURCES.modal.create.action);
//		$('#taskModal').find('[data-freeze="view"]').removeAttr('readonly');
//		$select.prop('disabled', false);
//        cleanFormUserStoryModal();
//    });
//    $("#taskModal").on('show.bs.modal', function () {
//        if(sResponsibleTaskValid){
//            sResponsibleTaskValid = false;
//            buildResponsibleComponent();
//        }
//    });
//    $("#mActionTask").click(function(){
//        var $this = $(this), action = $this.attr('data-action');
//        if(action === 'create'){
//            if(Object.keys(userStories).length === 0){
//                $('#containerUserStoriesDetail').empty();
//            }
//            incrementalAuxUserStories++;
//            userStories[incrementalAuxUserStories.toString()] = {
//                'Name': $('#iNameTask').val(), 'IdProject': idProject, 'Description': $('#taDescriptionTask').val(),
//                'IdUserResponsable': select2Val.id, 'UserResponsable': select2Val.text,
//                'Effort': $('#iEffortTask').val(), 'Priority': $('#iPriorityTask').val(),
//                'AcceptanceCriteria': $('#taCriteriaOfAcceptanceTask').val(), 'aux': incrementalAuxUserStories.toString()
//            };
//            buildContainerUserStory(userStories[incrementalAuxUserStories.toString()], incrementalAuxUserStories.toString());		
//			saveToDatabaseUserStory(userStories[incrementalAuxUserStories.toString()]);
//        }
//    });
//    $("#btnCreateSprint").click(function(){
//        buildContainerSprint();
//    });
//	$("#btnMatchSprintHU").click(function(){
//		//AQUI PONER URL PARA IR A PAGINA DE RELACIONAR SPRINT CON HISTORIAS DE USUARIO
//        location.href = "https://adminlte.io/themes/AdminLTE/pages/forms/general.html";
//    });
//}

//function buildResponsibleComponent(){
//    $select = $('#sResponsibleTask').select2({
//        'theme': 'bootstrap', 'placeholder': RESOURCES.select2, 'language': 'es',
//        'minimumResultsForSearch': Infinity, 'data': dataResponsibles,
//        'dropdownParent': $('#containerResponsibleTask')
//    });
//    $select.val(null).trigger('change');
//    $select.on('change', function(e) {
//        if(typeof $select.select2('data')[0] !== 'undefined'){
//            select2Val.id = $(this).val();
//            select2Val.text = $select.select2('data')[0].text;
//        }
//    });
//}

//function getAllResponsibles(){
//	var URI = "";
//    URI = "data/list_responsibles.json";
//    $.ajax({
//        'url': URI,
//        'contentType': "application/json",
//        'dataType': "json",
//        'type': "GET",
//        'cache': true,
//        'async': true
//    }).done(function(data, textStatus, jqXHR) {
//        var datas = data.Data, iData, node;
//        for(iData in datas){
//            node = datas[iData];
//            dataResponsibles.push({'id': node.Uid, 'text': node.Name});
//        }
//    }).fail(function(jqXHR, textStatus, errorThrown) {
//        console.log(jqXHR);
//        console.log(textStatus);
//        console.log(errorThrown);
//    });
//}

//function renderProjectDetail(){
//	var data = dataProjectDetail.Data, dataUserStories = data.UserStories, dataSprints = data.Sprints,
//		userStory, iUserStory;
//	//General
//	$('#iNameProject').val(data.Name);	
//	buildDatesComponent($('#iDatesProject'), '#containerDates', 'auto', 
//		{'startDate': data.StartDate, 'endDate': data.EndDate});
//	$('#taDescriptionProject').val(data.Description);
//	idProject = data.Uid;
//	//Historias de Usuario
//	for(iUserStory in dataUserStories){
//		incrementalAuxUserStories++;
//		userStory = dataUserStories[iUserStory];
//		userStories[incrementalAuxUserStories] = {
//			'Uid': userStory.Uid, 'Name': userStory.Name, 'Description': userStory.Description, 
//			'IdUserResponsable': userStory.IdUserResponsable, 'UserResponsable': userStory.UserResponsable, 
//			'Effort': userStory.Effort, 'Priority': userStory.Priority, 
//			'AcceptanceCriteria': userStory.AcceptanceCriteria
//		}
//		buildContainerUserStory(userStories[incrementalAuxUserStories.toString()], incrementalAuxUserStories.toString());
//	}
//}

//function buildContainerUserStory(data, id){
//    var context = {}, nodes = [], project, iProject,
//        source = document.getElementById("temp-user-story-container").innerHTML,
//        template = Handlebars.compile(source);
//    context.name = data.Name;
//    context.id = id;
//    if(colorsIncrementalAux === colorsTotalAux){
//        colorsIncrementalAux = 0;
//    }
//    context.style = 'style="background-color: '.concat(COLORS[colorsIncrementalAux]).concat(';')
//        .concat(' color: #fff;"');
//    colorsIncrementalAux++;
//    $('#containerUserStoriesDetail').append(template(context));
//    $("#mBtnUpdateUserStory".concat(id)).on('click', function(){
//        var $this = $(this), id = $this.attr('data-id');
//        itemUserStoryAux = clone(userStories[id]);
//        $("#taskModal").modal("show");
//        $('#taskModalTitle').text(RESOURCES.modal.view.title);
//		$('#mUserStoryFooter').addClass('hidden');
//        updateFormUserStoryModal(itemUserStoryAux);
//		$('#taskModal').find('[data-freeze="view"]').attr('readonly', 'readonly');
//		$select.prop('disabled', true);
//    });
//}

//function cleanFormUserStoryModal(){
//    $('#iNameTask').val("");
//    $('#taDescriptionTask').val("");
//    $select.val(null).trigger('change');
//    $('#iEffortTask').val("");
//    $('#iPriorityTask').val("");
//    $('#taCriteriaOfAcceptanceTask').val("");
//}

//function updateFormUserStoryModal(data){
//    $('#iNameTask').val(data.Name);
//    $('#taDescriptionTask').val(data.Description);
//    $select.val(data.IdUserResponsable).trigger('change');
//    $('#iEffortTask').val(data.Effort);
//    $('#iPriorityTask').val(data.Priority);
//    $('#taCriteriaOfAcceptanceTask').val(data.AcceptanceCriteria);
//}

//function buildContainerSprint(){
//    var context = {}, nodes = [], project, iProject,
//        source = document.getElementById("temp-sprint-container").innerHTML,
//        template = Handlebars.compile(source);
//	if(sprintCreated){
//		sprintCreated = false;
//		$('#containerSprintDetail').empty();
//	}
//	if(colorsIncrementalAuxSprint === colorsTotalAux){
//        colorsIncrementalAuxSprint = 0;
//    }
//	styleSprint = 'style="background-color: '.concat(COLORS[colorsIncrementalAuxSprint]).concat(';')
//        .concat(' color: #fff;"');
//	context.style = styleSprint;
//	colorsIncrementalAuxSprint++;
//    $('#containerSprintDetail').append(template(context));
//	$("#btnItemSprintCreate").on('click', function(){
//        var $this = $(this), id = $this.attr('data-id'), name;
//        name = $('#nameItemSprint').val();
//		saveToDatabaseSprint({'Name': name, 'IdProject': idProject});
//		$('#containerItemSprintParent').remove();
//		buildContainerCreatedSprint(name, styleSprint);
//    });
//    $("#btnItemSprintRemove").on('click', function(){
//        $('#containerItemSprintParent').remove();
//		if(incrementalAuxSprints === 0){
//			buildContainerMsgEmptySprint();
//			sprintCreated = true;
//		}
//    });
//}

//function buildContainerCreatedSprint(name, style){
//    var context = {}, nodes = [], project, iProject,
//        source = document.getElementById("temp-sprint-created-container").innerHTML,
//        template = Handlebars.compile(source);
//	incrementalAuxSprints++;
//	context.name = name;
//	context.style = style;
//	context.id = incrementalAuxSprints;
//    $('#containerSprintDetail').append(template(context));
//}

//function buildContainerMsgEmptySprint(){
//    var context = {}, nodes = [], project, iProject,
//        source = document.getElementById("temp-sprints-empty-msg").innerHTML,
//        template = Handlebars.compile(source);
//    $('#containerSprintDetail').append(template(context));
//}

////AQUI SE DEBE INSERTAR EN LA BASE DE DATOS
//function saveToDatabaseUserStory(obj){
//	var data = clone(obj);
//	delete data.aux;
//	console.log(data);
//}

//function saveToDatabaseSprint(obj){
//	console.log(obj);
//}