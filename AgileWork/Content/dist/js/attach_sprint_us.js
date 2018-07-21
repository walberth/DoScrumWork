var sResponsibleTaskValid = true,
    incrementalAuxUserStories = 0,
    select2Val = { 'id': null, 'text': null },
    RESOURCES = {
        'select2': "Seleccione",
        'modal': {
            'create': {
                'title': "Crear Historia de Usuario",
                'button': "Crear",
                'action': "create"
            },
            'view': {
                'title': "Detalle Historia de Usuario",
                'button': null,
                'action': "view"
            }
        }
    },
    COLORS = [
        '#00a65a', '#f39c12', '#00c0ef', '#3c8dbc', '#dd4b39', '#b32d00', '#ff8c1a', '#99cc00', '#9900cc', '#663300'
    ],
    colorsIncrementalAux = 0,
    colorsTotalAux = COLORS.length - 1,
    dataResponsibles = [],
    userStories = {},
    itemUserStoryAux = {},
    $select,
    data,
    idProject,
    incrementalAuxSprints = 0,
    colorsIncrementalAuxSprint = 0,
    sprintCreated = true,
    styleSprint,
    sprints = {},
    idDragEventUS,
    dataAttachSprintUS;

function initializeAttachSprint(){
    initializeEventsAttach();
    getProjectInformation();
    getAllResponsibles();
}

function initializeEventsAttach(){
    $("#btnProjectDetail").click(function(){
        location.href = "/Project/ReturnProjectDetail";
    });
    $("#taskModal").on('show.bs.modal', function () {
        if(sResponsibleTaskValid){
            sResponsibleTaskValid = false;
            buildResponsibleComponent();
        }
    });
}

function getProjectInformation() {
    $.ajax({
        url: '/Project/GetSprintAndUserStorie',
        type: 'POST'
    }).done(function(e) {
        dataAttachSprintUS = e;
        renderSprintsUS();
    });
}

function buildResponsibleComponent(){
    $select = $('#sResponsibleTask').select2({
        'theme': 'bootstrap', 'placeholder': RESOURCES.select2, 'language': 'es',
        'minimumResultsForSearch': Infinity, 'data': dataResponsibles,
        'dropdownParent': $('#containerResponsibleTask')
    });
    $select.val(null).trigger('change');
    $select.on('change', function(e) {
        if(typeof $select.select2('data')[0] !== 'undefined'){
            select2Val.id = $(this).val();
            select2Val.text = $select.select2('data')[0].text;
        }
    });
}

function getAllResponsibles(){
    $.ajax({
        'url': '/Project/GetUserResponsable',
        'contentType': "application/json",
        'dataType': "json",
        'type': "GET",
        'cache': true,
        'async': true
    }).done(function(e) {
        var datas = e, 
            iData, 
            node;

        for(iData in datas){
            node = datas[iData];
            dataResponsibles.push({'id': node.Uid, 'text': node.Name});
        }
    }).fail(function(jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
    });
}

function renderSprintsUS(){
    var data = dataAttachSprintUS.data, 
        dataUserStories = data.userStories, 
        dataSprints = data.sprints,
		userStory, 
        iUserStory, 
        sprint, 
        iSprint, 
        sprintAttachUS = false;

    //Sprints
    if(dataSprints.length > 0){
        for(iSprint in dataSprints){
            sprint = dataSprints[iSprint];
            sprints[sprint.uid] = {
                'uid': sprint.uid, 'name': sprint.name
            }
            if(sprint.stories !== null){
                sprintAttachUS = true;
            }
            buildContainerSprint(sprints[sprint.uid], sprint.uid, sprintAttachUS);
        }
    } else {
        buildContainerMsgEmptySprints();
    }
    //Historias de Usuario
    if(dataUserStories.length > 0) {
        for(iUserStory in dataUserStories){
            userStory = dataUserStories[iUserStory];

            userStories[userStory.uid] = {
                'uid': userStory.uid,
                'name': userStory.name,
                'description': userStory.description,
                'idUserResponsable': userStory.idUserResponsable,
                'userResponsable': userStory.userResponsable,
                'effort': userStory.effort, 
                'priority': userStory.priority,
                'acceptanceCriteria': userStory.acceptanceCriteria, 
                'idSprint': userStory.idSprint
            }
            
            buildContainerUserStoryAttach(userStories[userStory.uid], userStory.uid);
        }
    } else {
        buildContainerMsgEmptyUnassignedUS();
    }
}

function buildContainerUserStoryAttach(data, id){
    var context = {}, 
        nodes = [],
        project, 
        iProject,
        source = document.getElementById("temp-user-story-container").innerHTML,
        template = Handlebars.compile(source), height;

    context.name = data.name;
    context.id = id;
    if(colorsIncrementalAux === colorsTotalAux){
        colorsIncrementalAux = 0;
    }
    context.style = 'style="background-color: '.concat(COLORS[colorsIncrementalAux]).concat(';').concat(' color: #fff;"');

    colorsIncrementalAux++;
    if(data.idSprint === null){
        $('#contentUnassignedUS').append(template(context));
        $('#containerItemUserStory'.concat(id)).draggable({
            'zIndex': 10000,
            'revert': "invalid",
            'cursor': "move",
            'drag': function(event, ui) {
                idDragEventUS = id;
            }
        });
    } else {
        $('#msgEmptySprint'.concat(data.idSprint)).remove();
        $('#contentAttachedUserStories'.concat(data.idSprint)).append(template(context));
        if(!$("#contentAttachedUserStories".concat(data.idSprint)).hasClass('box-sprint-us-height-auto')){
            $("#contentAttachedUserStories".concat(data.idSprint)).removeClass('box-sprint-us-height-50px');
            $("#contentAttachedUserStories".concat(data.idSprint)).addClass('box-sprint-us-height-auto');
        }
        height = $("#contentAttachedUserStories".concat(data.idSprint)).height();
        $("#contentAttachedSprint".concat(data.idSprint)).css('height',height.toString().concat('px'));
    }
    $("#mBtnDetailUserStory".concat(id)).on('click', function(){
        var $this = $(this), id = $this.attr('data-id');
        itemUserStoryAux = clone(userStories[id]);
        $("#taskModal").modal("show");
        cleanFormUserStoryModal();
        updateFormUserStoryModal(itemUserStoryAux);
		$select.prop('disabled', true);
    });
}

function cleanFormUserStoryModal(){
    $('#iNameTask').val("");
    $('#taDescriptionTask').val("");
    $select.val(null).trigger('change');
    $('#iEffortTask').val("");
    $('#iPriorityTask').val("");
    $('#taCriteriaOfAcceptanceTask').val("");
}

function updateFormUserStoryModal(data){
    $('#iNameTask').val(data.name);
    $('#taDescriptionTask').val(data.description);
    $select.val(data.idUserResponsable).trigger('change');
    $('#iEffortTask').val(data.effort);
    $('#iPriorityTask').val(data.priority);
    $('#taCriteriaOfAcceptanceTask').val(data.acceptanceCriteria);
}

function buildContainerSprint(data, id, hasUS){
    var context = {}, nodes = [], project, iProject,
        source = document.getElementById("temp-sprint-container").innerHTML,
        template = Handlebars.compile(source);
    context.name = data.name;
    context.id = id;
	if(colorsIncrementalAuxSprint === colorsTotalAux){
        colorsIncrementalAuxSprint = 0;
    }
	styleSprint = 'style="background-color: '.concat(COLORS[colorsIncrementalAuxSprint]).concat(';')
        .concat(' color: #fff;"');
	context.style = styleSprint;
	colorsIncrementalAuxSprint++;
    $('#contentAttachSprintUS').append(template(context));
    $("#contentAttachedUserStories".concat(id)).droppable({
        'drop': function( event, ui ) {
            var height;
            saveToDatabaseAttachSprintUS(idDragEventUS, id);
            $('#containerItemUserStory'.concat(idDragEventUS)).draggable("destroy");
            $('#containerItemUserStory'.concat(idDragEventUS)).removeAttr('style');
            if($("#msgEmptySprint".concat(id)).length === 1){
                $("#msgEmptySprint".concat(id)).remove();
            }
            $("#contentAttachedUserStories".concat(id)).append($('#containerItemUserStory'.concat(idDragEventUS)));
            if(!$("#contentAttachedUserStories".concat(id)).hasClass('box-sprint-us-height-auto')){
                $("#contentAttachedUserStories".concat(id)).removeClass('box-sprint-us-height-50px');
                $("#contentAttachedUserStories".concat(id)).addClass('box-sprint-us-height-auto');
            }
            height = $("#contentAttachedUserStories".concat(id)).height();
            $("#contentAttachedSprint".concat(id)).css('height',height.toString().concat('px'));
            if($('#contentUnassignedUS').children().length === 0){
                buildContainerMsgEmptyUnassignedUS();
            }
        }
    });
}

function buildContainerCreatedSprint(name, style){
    var context = {}, nodes = [], project, iProject,
        source = document.getElementById("temp-sprint-created-container").innerHTML,
        template = Handlebars.compile(source);
	incrementalAuxSprints++;
	context.name = name;
	context.style = style;
	context.id = incrementalAuxSprints;
    $('#containerSprintDetail').append(template(context));
}

function buildContainerMsgEmptyUnassignedUS(){
    var context = {}, nodes = [], project, iProject,
        source = document.getElementById("temp-us-empty-msg").innerHTML,
        template = Handlebars.compile(source);
    $('#contentUnassignedUS').append(template(context));
}

function buildContainerMsgEmptySprints(){
    var context = {}, nodes = [], project, iProject,
        source = document.getElementById("temp-sprints-empty-msg").innerHTML,
        template = Handlebars.compile(source);
    $('#contentAttachSprintUS').append(template(context));
}

//AQUI SE DEBE INSERTAR EN LA BASE DE DATOS
function saveToDatabaseAttachSprintUS(idUs, idSprint){
    var data = {'IdUserStory': idUs, 'IdSprint': idSprint}

    $.ajax({
        url:  '/Project/SetUserStorieToSprint',
        type: 'POST',
        data: { model: data }
    }).done(function (e) {
        console.log(e);
    });
}
