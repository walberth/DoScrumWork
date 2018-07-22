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
    dataSprintBoard;

function initialize_dashboard() {
    initializeEventsDasboard();
    getSprintBoardInformation();
    getAllResponsiblesDashboard();
}

function initializeEventsDasboard(){
    $("#btnProjectDetail").click(function() {
        window.history.back();
    });
    $("#taskModal").on('show.bs.modal', function () {
        if(sResponsibleTaskValid){
            sResponsibleTaskValid = false;
            buildResponsibleComponent();
        }
    });
}

function buildResponsibleComponent(){
    $select = $('#sResponsibleTask').select2({
        'theme': 'bootstrap', 
        'placeholder': RESOURCES.select2, 
        'language': 'es',
        'minimumResultsForSearch': Infinity, 
        'data': dataResponsibles,
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

function getAllResponsiblesDashboard(){
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

function getSprintBoardInformation() {
    $.ajax({
        url: '/Project/GetDashboardInfo',
        type: 'POST'
    }).done(function(e) {
        dataSprintBoard = e;
        renderUSTasks();
    });
}

function renderUSTasks(){
	var data = dataSprintBoard.data, 
	    dataUserStories = data.stories, 
	    dataTasks = data.tasks,
		userStory, 
	    iUserStory, 
	    task, 
	    iTask, 
	    sprintAttachUS = false;

    //Sprint
	$('#iNameSprint').val(data.name);
	$('#iNameSprint').attr('data-project', data.idProject);
	$('#iNameSprint').attr('data-id', data.uid);

	//Historias de Usuario
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
			'idSprint': userStory.idSprint,
			'state': userStory.state
		}
		buildContainerUserStory(userStories[userStory.uid], userStory.uid);
	}

	//Tareas
	for(iTask in dataTasks) {
		task = dataTasks[iTask];
		usTasks[task.uid] = {
			'uid': task.uid, 
			'name': task.name, 
			'idUserHistories': task.idUserHistories,
			'state': task.state
		}
		buildContainerTask(usTasks[task.uid], task.uid);
	}
}

function buildContainerUserStory(data, id){
    var context = {}, nodes = [], project, iProject, styleUS,
        source = document.getElementById("temp-us-tasks-container").innerHTML,
        template = Handlebars.compile(source), height, taskHelperDroppable;
    context.id = id;
    if(colorsIncrementalAux === colorsTotalAux){
        colorsIncrementalAux = 0;
    }
	styleUS = 'style="background-color: '.concat(COLORS[colorsIncrementalAux]).concat(';')
        .concat(' color: #fff;"');
    colorsIncrementalAux++;
	context.userStory = buildContainerItemUserStory(id, data.name, styleUS);
	$('#boardContent').append(template(context));
	$("#mBtnDetailUserStory".concat(id)).on('click', function(){
        var $this = $(this), id = $this.attr('data-id');
        itemUserStoryAux = clone(userStories[id]);
        $("#taskModal").modal("show");
        cleanFormUserStoryModal();
        updateFormUserStoryModal(itemUserStoryAux);
		$select.prop('disabled', true);
    });
	$("#mBtnCreateTask".concat(id)).on('click', function(){
		buildContainerCreatedPreTask($(this));
    });
	taskHelperDroppable = ".droppable-helper".concat(id);
	$("#containerBoardStatusToDo".concat(id)).droppable({
		//'accept': taskHelperDroppable,
		'accept': function(event){
			var stateBlock, stateTask, idUs, idTaskUs;
			stateTask = $(event).attr('data-state');
			stateBlock = $(this).attr('data-state');
			idUs = $(this).attr('data-id');
			idTaskUs = $(event).attr('data-us');
			if(idUs === idTaskUs){
				if(stateTask !== stateBlock){
					return true;
				}
			}
		},
        'drop': function( event, ui ) {
            var $edrag, idUs, idTask, state, $blockState, blockState, $edragClone, $lastChild;
			console.log("drop");
			$blockState = $(event.target);
			blockState = $blockState.attr('data-state');
			$edrag = $(ui.helper);
			idTask = $edrag.attr('data-id');
			idUs = $edrag.attr('data-us');
			state = $edrag.attr('data-state');
			saveToDatabaseTaskUS(idTask, id, blockState);
			$edrag.attr('data-state', blockState);
            $edrag.removeAttr('style');
			if($blockState.children().length > 0){
				$lastChild = $blockState.children().last();
				if($lastChild.attr('data-element') === 'button'){
					$lastChild.before($edrag);
				} else {
					$lastChild.after($edrag);
				}
			} else {
				$edrag.appendTo($blockState);
			}
			calculateHeightContainer(id);
        }
    });
	$("#containerBoardStatusInProgress".concat(id)).droppable({
		'accept': function(event){
			var stateBlock, stateTask, idUs, idTaskUs;
			stateTask = $(event).attr('data-state');
			stateBlock = $(this).attr('data-state');
			idUs = $(this).attr('data-id');
			idTaskUs = $(event).attr('data-us');
			if(idUs === idTaskUs){
				if(stateTask !== stateBlock){
					return true;
				}
			}
		},
        'drop': function(event, ui) {
            var $edrag, idUs, idTask, state, $blockState, blockState, $edragClone, $lastChild;
			console.log("drop");
			$blockState = $(event.target);
			blockState = $blockState.attr('data-state');
			$edrag = $(ui.helper);
			idTask = $edrag.attr('data-id');
			idUs = $edrag.attr('data-us');
			state = $edrag.attr('data-state');
			saveToDatabaseTaskUS(idTask, id, blockState);
			$edrag.attr('data-state', blockState);
            $edrag.removeAttr('style');
			if($blockState.children().length > 0){
				$lastChild = $blockState.children().last();
				$lastChild.after($edrag);
			} else {
				$edrag.appendTo($blockState);
			}
			calculateHeightContainer(id);
        }
    });
	$("#containerBoardStatusDone".concat(id)).droppable({
        'accept': function(event){
			var stateBlock, stateTask, idUs, idTaskUs;
			stateTask = $(event).attr('data-state');
			stateBlock = $(this).attr('data-state');
			idUs = $(this).attr('data-id');
			idTaskUs = $(event).attr('data-us');
			if(idUs === idTaskUs){
				if(stateTask !== stateBlock){
					return true;
				}
			}
		},
        'drop': function( event, ui ) {
            var $edrag, idUs, idTask, state, $blockState, blockState, $edragClone, $lastChild;
			console.log("drop");
			$blockState = $(event.target);
			blockState = $blockState.attr('data-state');
			$edrag = $(ui.helper);
			idTask = $edrag.attr('data-id');
			idUs = $edrag.attr('data-us');
			state = $edrag.attr('data-state');
			saveToDatabaseTaskUS(idTask, id, blockState);
			$edrag.attr('data-state', blockState);
            $edrag.removeAttr('style');
			if($blockState.children().length > 0){
				$lastChild = $blockState.children().last();
				$lastChild.after($edrag);
			} else {
				$edrag.appendTo($blockState);
			}
			calculateHeightContainer(id);
        }
    });
}

function calculateHeightContainer(idUs){
	var heightToDo, heightInProgress, heightDone, heightMax;
	$('#containerBoardStatusToDo'.concat(idUs)).css('height', 'auto');
	$('#containerBoardStatusInProgress'.concat(idUs)).css('height', 'auto');
	$('#containerBoardStatusDone'.concat(idUs)).css('height', 'auto');
	heightToDo = $('#containerBoardStatusToDo'.concat(idUs)).height();
	heightInProgress =  $('#containerBoardStatusInProgress'.concat(idUs)).height();
	heightDone =  $('#containerBoardStatusDone'.concat(idUs)).height();
	heightMax = Math.max(heightToDo, heightInProgress, heightDone);
	$('#containerBoardStatusToDo'.concat(idUs)).height(heightMax);
	$('#containerBoardStatusInProgress'.concat(idUs)).height(heightMax);
	$('#containerBoardStatusDone'.concat(idUs)).height(heightMax);
}

function buildContainerItemUserStory(id, name, style){
	var context = {}, nodes = [], project, iProject,
        source = document.getElementById("temp-item-us-container").innerHTML,
        template = Handlebars.compile(source);
	context.id = id;
	context.name = name;
    context.style = style;
	return template(context);
}

function buildContainerTask(data, id){
    var context = {}, nodes = [], project, iProject, styleUS,
        source = document.getElementById("temp-task-container").innerHTML,
        template = Handlebars.compile(source), $containerTask, $lastChild,
		heightToDo, heightInProgress, heightDone, heightMax, validateTasks = false;
    context.id = id;
	context.name = data.name;
	context.idUs = data.idUserHistories;
	context.state = data.state;
    if(colorsIncrementalAuxTask === colorsTotalAux){
        colorsIncrementalAuxTask = 0;
    }
	styleUS = 'style="background-color: '.concat(COLORS[colorsIncrementalAuxTask]).concat(';')
        .concat(' color: #fff;"');
	context.style = styleUS;
    colorsIncrementalAuxTask++;
	switch(data.state){
		case taskStatus.TODO:
			$containerTask = $('#containerBoardStatusToDo'.concat(data.idUserHistories));
		break;
		case taskStatus.INPROGRESS:
			$containerTask = $('#containerBoardStatusInProgress'.concat(data.idUserHistories));
		break;
		case taskStatus.DONE:
			$containerTask = $('#containerBoardStatusDone'.concat(data.idUserHistories));
		break;
	}
	if(data.state === taskStatus.TODO){
		$lastChild = $containerTask.children().last();
		$lastChild.before(template(context));
	} else {
		$containerTask.append(template(context));
	}
	$('#containerTaskUS'.concat(id)).draggable({
		'zIndex': 2000,
		'revert': true,
		'cursor': "move"
	});
	if($('#containerBoardStatusToDo'.concat(data.idUserHistories)).children().length > 3){
		validateTasks = true;
	}
	if($('#containerBoardStatusInProgress'.concat(data.idUserHistories)).children().length > 3){
		validateTasks = true;
	}
	if($('#containerBoardStatusDone'.concat(data.idUserHistories)).children().length > 3){
		validateTasks = true;
	}
	if(validateTasks){
		$('#containerBoardStatusToDo'.concat(data.idUserHistories)).css('height', 'auto');
		$('#containerBoardStatusInProgress'.concat(data.idUserHistories)).css('height', 'auto');
		$('#containerBoardStatusDone'.concat(data.idUserHistories)).css('height', 'auto');
		heightToDo = $('#containerBoardStatusToDo'.concat(data.idUserHistories)).height();
		heightInProgress =  $('#containerBoardStatusInProgress'.concat(data.idUserHistories)).height();
		heightDone =  $('#containerBoardStatusDone'.concat(data.idUserHistories)).height();
		heightMax = Math.max(heightToDo, heightInProgress, heightDone);
		$('#containerBoardStatusToDo'.concat(data.idUserHistories)).height(heightMax);
		$('#containerBoardStatusInProgress'.concat(data.idUserHistories)).height(heightMax);
		$('#containerBoardStatusDone'.concat(data.idUserHistories)).height(heightMax);
	}
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
    console.log(data.idUserResponsable);
    $select.val(data.idUserResponsable).trigger('change');
    $('#iEffortTask').val(data.effort);
    $('#iPriorityTask').val(data.priority);
    $('#taCriteriaOfAcceptanceTask').val(data.acceptanceCriteria);
}

function buildContainerCreatedPreTask($element){
    var context = {}, 
        nodes = [], styleUS,
        source = document.getElementById("temp-task-pre-created-container").innerHTML,
        template = Handlebars.compile(source), idUs;
	colorsIncrementalAuxPreTask++;
	if(colorsIncrementalAuxPreTask === colorsTotalAux){
        colorsIncrementalAuxPreTask = 0;
    }
	styleUS = 'style="background-color: '.concat(COLORS[colorsIncrementalAuxPreTask]).concat(';')
        .concat(' color: #fff;"');
	context.style = styleUS;
	idUs = $element.attr('data-id');
	context.idus = idUs;
    colorsIncrementalAuxPreTask++;
    $element.parent().before(template(context));
	calculateHeightContainer(idUs);
	$('#btnItemPreTaskCreate').on('click', function(){
		var name = $('#nameItemPreTask').val(), idUs = $(this).attr('data-us'), state = taskStatus.TODO;
		$('#containerPreCreatedTaskUS').remove();
		incrementalAuxTask++;
		usTasks[incrementalAuxTask] = {
			'uid': incrementalAuxTask, 'name': name, 'idUserHistories': idUs, 'state': state
		}
		saveToDatabaseNewTask(name, idUs, state);
		buildContainerTask(usTasks[incrementalAuxTask], incrementalAuxTask);
		calculateHeightContainer(idUs);
	});
	$('#btnItemPreTaskRemove').on('click', function(){
		$('#containerPreCreatedTaskUS').remove();
		calculateHeightContainer($(this).attr('data-us'));
	});
}

//Change Task State
function saveToDatabaseTaskUS(idTask, idUs, state){
	var obj = {
		'idTask': idTask, 
		'idUs': idUs, 
		'state': state
	};

    $.ajax({
        url: '/Project/UpdateTaskState',
        type: 'POST',
        data: { model: obj }
    }).done(function(e) {
        console.log(e);
    });

	return obj;
}

function saveToDatabaseNewTask(name, idUs, state){
	var obj = {
		'name': name, 
		'idUs': idUs, 
		'state': state
	};

    $.ajax({
        url: '/Project/CreateTask',
        type: 'POST',
        data: { model: obj }
    }).done(function(e) {
        console.log(e);
    });

	return obj;
}
