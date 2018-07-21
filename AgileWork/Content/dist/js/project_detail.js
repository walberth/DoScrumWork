//var sResponsibleTaskValid = true, 
//    incrementalAuxUserStories = 0, 
//    select2Val = {'id': null, 'text': null},
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
//    COLORS = ['#00a65a', '#f39c12', '#00c0ef', '#3c8dbc', '#dd4b39', '#b32d00', '#ff8c1a', '#99cc00', '#9900cc', '#663300'],
//    colorsIncrementalAux = 0, 
//    colorsTotalAux = COLORS.length - 1, 
//    dataResponsibles = [], 
//    userStories = {},
//    itemUserStoryAux = {}, 
//    $select, 
//    data, 
//    idProject, 
//    incrementalAuxSprints = 0,
//    colorsIncrementalAuxSprint = 0,
//	sprintCreated = true, 
//    styleSprint,
//    dataProjectDetail;

//function initializeDetail(){
//    initializeEventsDetail();
//    getProjectinformation();
//    getAllResponsiblesProject();
//}

//function initializeEventsDetail(){
//    $("#btnCreateTask").click(function(){
//        $("#taskModal").modal("show");
//        $('#taskModalTitle').text(RESOURCES.modal.create.title);
//        $('#mActionTask').text(RESOURCES.modal.create.button);
//		$('#mUserStoryFooter').removeClass('hidden');
//        $('#mActionTask').attr('data-action', RESOURCES.modal.create.action);
//		$('#taskModal').find('[data-freeze="view"]').removeAttr('readonly');
//		$select.prop('disabled', false);
//        cleanFormUserStoryModalDetail();
//    });
//    $("#taskModal").on('show.bs.modal', function () {
//        if(sResponsibleTaskValid){
//            sResponsibleTaskValid = false;
//            buildResponsibleComponentDetail();
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
//                'Name': $('#iNameTask').val(), 
//                'IdProject': idProject, 
//                'Description': $('#taDescriptionTask').val(),
//                'IdUserResponsable': select2Val.id, 
//                'UserResponsable': select2Val.text,
//                'Effort': $('#iEffortTask').val(), 
//                'Priority': $('#iPriorityTask').val(),
//                'AcceptanceCriteria': $('#taCriteriaOfAcceptanceTask').val(), 
//                'aux': incrementalAuxUserStories.toString()
//            };
//            buildContainerUserStoryDetail(userStories[incrementalAuxUserStories.toString()], incrementalAuxUserStories.toString());
//			saveToDatabaseUserStory(userStories[incrementalAuxUserStories.toString()]);
//        }
//    });
//    $("#btnCreateSprint").click(function(){
//        buildContainerSprintDetail();
//    });
//	$("#btnMatchSprintHU").click(function(){
//		//AQUI PONER URL PARA IR A PAGINA DE RELACIONAR SPRINT CON HISTORIAS DE USUARIO
//        location.href = "https://adminlte.io/themes/AdminLTE/pages/forms/general.html";
//    });
//}

//function buildResponsibleComponentDetail(){
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

//function getProjectinformation() {
//    $.ajax({
//        url: '/Project/ObtainProjectDetail',
//        type: 'POST'
//    }).done(function(e) {
//        dataProjectDetail = e;
//        renderProjectDetail();
//    });
//}

//function getAllResponsiblesProject(){
//    $.ajax({
//        'url': '/Project/GetUserResponsable',
//        'contentType': "application/json",
//        'dataType': "json",
//        'type': "GET",
//        'cache': true,
//        'async': true
//    }).done(function(e) {
//        var datas = e, 
//            iData, 
//            node;

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
//    console.log(dataProjectDetail.data);
//    console.log(dataProjectDetail.data.userStories);

//	var data = dataProjectDetail.data, 
//	    dataUserStories = data.userStories, 
//	    dataSprints = data.sprints,
//		userStory,
//	    iUserStory;

//	//General
//	$('#iNameProject').val(data.name);
//	buildDatesComponent($('#iDatesProject'), '#containerDates', 'auto',
//		{'startDate': data.startDate, 'endDate': data.endDate});
//	$('#taDescriptionProject').val(data.description);
//	idProject = data.uid;

//    //Historias de Usuario
//	for(iUserStory in dataUserStories){
//		incrementalAuxUserStories++;

//		userStory = dataUserStories[iUserStory];
//		userStories[incrementalAuxUserStories] = {
//			'Uid': userStory.uid, 
//			'Name': userStory.name, 
//			'Description': userStory.description,
//			'IdUserResponsable': userStory.idUserResponsable, 
//			'UserResponsable': userStory.userResponsable,
//			'Effort': userStory.effort, 
//			'Priority': userStory.priority,
//			'AcceptanceCriteria': userStory.acceptanceCriteria
//		}
//		buildContainerUserStoryDetail(userStories[incrementalAuxUserStories.toString()], incrementalAuxUserStories.toString());
//	}

//    //Sprints
//    if(dataSprints.length > 0){
//        for(iSprint in dataSprints){
//            sprint = dataSprints[iSprint];
//            sprints[sprint.uid] = {
//                'uid': sprint.uid, 
//                'name': sprint.name
//            }
//            if(sprint.stories !== null){
//                sprintAttachUS = true;
//            }
//            buildContainerSprintDetail();
//        }
//    } else {
//        buildContainerMsgEmptySprintDetail();
//    }
//}

//function buildContainerUserStoryDetail(data, id){
//    var context = {}, nodes = [], project, iProject,
//        source = document.getElementById("temp-user-story-container").innerHTML,
//        template = Handlebars.compile(source);
//    context.name = data.Name;
//    context.id = id;

//    if(colorsIncrementalAux === colorsTotalAux){
//        colorsIncrementalAux = 0;
//    }

//    context.style = 'style="background-color: '.concat(COLORS[colorsIncrementalAux]).concat(';').concat(' color: #fff;"');
//    colorsIncrementalAux++;
//    $('#containerUserStoriesDetail').append(template(context));

//    $("#mBtnUpdateUserStory".concat(id)).on('click', function(){
//        var $this = $(this), 
//            id = $this.attr('data-id');

//        console.log(userStories[id].Uid);
//        console.log(userStories[id].Description);
//        console.log(userStories[id].IdUserResponsable);
//        console.log(userStories[id].Effort);
//        console.log(userStories[id].Priority);
//        console.log(userStories[id].AcceptanceCriteria);

//        itemUserStoryAux = clone(userStories[id]);
//        $("#taskModal").modal("show");
//        $('#taskModalTitle').text(RESOURCES.modal.view.title);
//		$('#mUserStoryFooter').addClass('hidden');
//        updateFormUserStoryModalDetail(itemUserStoryAux);
//		$('#taskModal').find('[data-freeze="view"]').attr('readonly', 'readonly');
//		$select.prop('disabled', true);
//    });
//}

//function cleanFormUserStoryModalDetail(){
//    $('#iNameTask').val("");
//    $('#taDescriptionTask').val("");
//    $select.val(null).trigger('change');
//    $('#iEffortTask').val("");
//    $('#iPriorityTask').val("");
//    $('#taCriteriaOfAcceptanceTask').val("");
//}

//function updateFormUserStoryModalDetail(data) {
//    console.log(data.Uid);
//    console.log(data.Description);
//    console.log(data.IdUserResponsable);
//    console.log(data.effort);
//    console.log(data.priority);
//    console.log(data.acceptanceCriteria);

//    $('#iNameTask').val(data.Name);
//    $('#taDescriptionTask').val(data.Description);
//    $select.val(data.IdUserResponsable).trigger('change');
//    $('#iEffortTask').val(data.Effort);
//    $('#iPriorityTask').val(data.Priority);
//    $('#taCriteriaOfAcceptanceTask').val(data.AcceptanceCriteria);
//}

//function buildContainerSprintDetail(){
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
//	styleSprint = 'style="background-color: '.concat(COLORS[colorsIncrementalAuxSprint]).concat(';').concat(' color: #fff;"');
//	context.style = styleSprint;
//	colorsIncrementalAuxSprint++;
//    $('#containerSprintDetail').append(template(context));
//	$("#btnItemSprintCreate").on('click', function(){
//        var $this = $(this), id = $this.attr('data-id'), name;
//        name = $('#nameItemSprint').val();
//		saveToDatabaseSprint({'Name': name, 'IdProject': idProject});
//		$('#containerItemSprintParent').remove();
//		buildContainerCreatedSprintDetail(name, styleSprint);
//    });
//    $("#btnItemSprintRemove").on('click', function(){
//        $('#containerItemSprintParent').remove();
//		if(incrementalAuxSprints === 0){
//			buildContainerMsgEmptySprint();
//			sprintCreated = true;
//		}
//    });
//}

//function buildContainerCreatedSprintDetail(name, style){
//    var context = {}, nodes = [], project, iProject,
//        source = document.getElementById("temp-sprint-created-container").innerHTML,
//        template = Handlebars.compile(source);
//	incrementalAuxSprints++;
//	context.name = name;
//	context.style = style;
//	context.id = incrementalAuxSprints;
//    $('#containerSprintDetail').append(template(context));
//    $('#mBtnGoToSprintDetail'.concat(incrementalAuxSprints)).on('click', function(){
//        location.href = "https://adminlte.io/themes/AdminLTE/pages/calendar.html";
//    });
//}

//function buildContainerMsgEmptySprintDetail(){
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
