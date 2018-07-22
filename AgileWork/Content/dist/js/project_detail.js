var sResponsibleTaskValid = true, incrementalAuxUserStories = 0, select2Val = { 'id': null, 'text': null },
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
    COLORS = ['#00a65a', '#f39c12', '#00c0ef', '#3c8dbc', '#dd4b39', '#b32d00', '#ff8c1a', '#99cc00',
        '#9900cc', '#663300'],
    dataProjectDetail,
    colorsIncrementalAux = 0, colorsTotalAux = COLORS.length - 1, dataResponsibles = [], userStories = {},
    itemUserStoryAux = {}, $select, data, idProject, incrementalAuxSprints = 0, colorsIncrementalAuxSprint = 0,
    sprintCreated = true, styleSprint, sprints = {};

function initializedetail() {
    initializeeventsdetail();
    getprojectinformationdetail();
    getAllResponsiblesProjectDetail();
}

function initializeeventsdetail() {
    $("#btnCreateTask").click(function () {
        $("#taskModal").modal("show");
        $('#taskModalTitle').text(RESOURCES.modal.create.title);
        $('#mActionTask').text(RESOURCES.modal.create.button);
        $('#mUserStoryFooter').removeClass('hidden');
        $('#mActionTask').attr('data-action', RESOURCES.modal.create.action);
        $('#taskModal').find('[data-freeze="view"]').removeAttr('readonly');
        $select.prop('disabled', false);
        cleanFormUserStoryModalDetail();
    });
    $("#taskModal").on('show.bs.modal', function () {
        if (sResponsibleTaskValid) {
            sResponsibleTaskValid = false;
            buildResponsibleComponentDetail();
        }
    });
    $("#mActionTask").click(function () {
        var $this = $(this), action = $this.attr('data-action');
        if (action === 'create') {
            if (Object.keys(userStories).length === 0) {
                $('#containerUserStoriesDetail').empty();
            }
            incrementalAuxUserStories++;
            userStories[incrementalAuxUserStories.toString()] = {
                'name': $('#iNameTask').val(), 'idProject': idProject, 'description': $('#taDescriptionTask').val(),
                'idUserResponsable': select2Val.id, 'userResponsable': select2Val.text,
                'effort': $('#iEffortTask').val(), 'priority': $('#iPriorityTask').val(),
                'acceptanceCriteria': $('#taCriteriaOfAcceptanceTask').val(), 'aux': incrementalAuxUserStories.toString()
            };
            buildContainerUserStoryDetail(userStories[incrementalAuxUserStories.toString()], incrementalAuxUserStories.toString());
            saveToDatabaseUserStoryDetail(userStories[incrementalAuxUserStories.toString()]);
        }
    });
    $("#btnCreateSprint").click(function () {
        buildContainerSprintDetail();
    });
    $("#btnMatchSprintHU").click(function () {
        location.href = "/Project/AttachToSprint";
    });
}

function buildResponsibleComponentDetail() {
    $select = $('#sResponsibleTask').select2({
        'theme': 'bootstrap', 'placeholder': RESOURCES.select2, 'language': 'es',
        'minimumResultsForSearch': Infinity, 'data': dataResponsibles,
        'dropdownParent': $('#containerResponsibleTask')
    });
    $select.val(null).trigger('change');
    $select.on('change', function (e) {
        if (typeof $select.select2('data')[0] !== 'undefined') {
            select2Val.id = $(this).val();
            select2Val.text = $select.select2('data')[0].text;
        }
    });
}

function getprojectinformationdetail() {
    $.ajax({
        url: '/Project/ObtainProjectDetail',
        type: 'POST'
    }).done(function (e) {
        dataProjectDetail = e;
        renderProjectDetail();
    });
}

function getAllResponsiblesProjectDetail() {
    $.ajax({
        'url': '/Project/GetUserResponsable',
        'contentType': "application/json",
        'dataType': "json",
        'type': "GET",
        'cache': true,
        'async': true
    }).done(function (e) {
        var datas = e,
            iData,
            node;
        for (iData in datas) {
            node = datas[iData];
            dataResponsibles.push({ 'id': node.Uid, 'text': node.Name });
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
    });
}

function renderProjectDetail() {
    var data = dataProjectDetail.data, dataUserStories = data.userStories, dataSprints = data.sprints,
        userStory, iUserStory, sprint, iSprint;
    //General
    $('#iNameProject').val(data.name);
    buildDatesComponent($('#iDatesProject'), '#containerDates', 'auto',
        { 'startDate': data.startDate, 'endDate': data.endDate});
    $('#iDatesProject').val(data.startDate.concat(' - ').concat(data.endDate));
    $('#taDescriptionProject').val(data.description);
    idProject = data.uid;
    console.log(dataUserStories);
    //Historias de Usuario
    for (iUserStory in dataUserStories) {
        incrementalAuxUserStories++;
        userStory = dataUserStories[iUserStory];
        userStories[userStory.uid] = {
            'uid': userStory.uid, 'name': userStory.name, 'description': userStory.description,
            'idUserResponsable': userStory.idUserResponsable, 'userResponsable': userStory.userResponsable,
            'effort': userStory.effort, 'priority': userStory.priority,
            'acceptanceCriteria': userStory.acceptanceCriteria
        }
        buildContainerUserStoryDetail(userStories[userStory.uid], userStory.uid);
    }
    //Sprints
    for (iSprint in dataSprints) {
        incrementalAuxUserStories++;
        sprint = dataSprints[iSprint];
        console.log(sprint);
        sprints[sprint.uid] = {
            'uid': sprint.uid, 'name': sprint.name
        }
        buildContainerCreatedSprintInitializeDetail(sprints[sprint.uid], sprint.uid);
    }
}

function buildContainerUserStoryDetail(data, id) {
    var context = {}, nodes = [], project, iProject,
        source = document.getElementById("temp-user-story-container").innerHTML,
        template = Handlebars.compile(source);
    context.name = data.name;
    context.id = id;
    if (colorsIncrementalAux === colorsTotalAux) {
        colorsIncrementalAux = 0;
    }
    context.style = 'style="background-color: '.concat(COLORS[colorsIncrementalAux]).concat(';')
        .concat(' color: #fff;"');
    colorsIncrementalAux++;
    $('#containerUserStoriesDetail').append(template(context));
    $("#mBtnUpdateUserStory".concat(id)).on('click', function () {
        var $this = $(this), id = $this.attr('data-id');
        itemUserStoryAux = clone(userStories[id]);
        $("#taskModal").modal("show");
        $('#taskModalTitle').text(RESOURCES.modal.view.title);
        $('#mUserStoryFooter').addClass('hidden');
        updateFormUserStoryModalDetail(itemUserStoryAux);
        $('#taskModal').find('[data-freeze="view"]').attr('readonly', 'readonly');
        $select.prop('disabled', true);
    });
}

function cleanFormUserStoryModalDetail() {
    $('#iNameTask').val("");
    $('#taDescriptionTask').val("");
    $select.val(null).trigger('change');
    $('#iEffortTask').val("");
    $('#iPriorityTask').val("");
    $('#taCriteriaOfAcceptanceTask').val("");
}

function updateFormUserStoryModalDetail(data) {
    console.log(data);
    $('#iNameTask').val(data.name);
    $('#taDescriptionTask').val(data.description);
    $select.val(data.idUserResponsable).trigger('change');
    $('#iEffortTask').val(data.effort);
    $('#iPriorityTask').val(data.priority);
    $('#taCriteriaOfAcceptanceTask').val(data.acceptanceCriteria);
}

function buildContainerSprintDetail() {
    var context = {}, nodes = [], project, iProject,
        source = document.getElementById("temp-sprint-container").innerHTML,
        template = Handlebars.compile(source);
    if (sprintCreated) {
        sprintCreated = false;
        $('#containerSprintDetail').empty();
    }
    if (colorsIncrementalAuxSprint === colorsTotalAux) {
        colorsIncrementalAuxSprint = 0;
    }
    styleSprint = 'style="background-color: '.concat(COLORS[colorsIncrementalAuxSprint]).concat(';')
        .concat(' color: #fff;"');
    context.style = styleSprint;
    colorsIncrementalAuxSprint++;
    $('#containerSprintDetail').append(template(context));
    $("#btnItemSprintCreate").on('click', function () {
        var $this = $(this), id = $this.attr('data-id'), name;
        name = $('#nameItemSprint').val();
        saveToDatabaseSprintDetail({ 'Name': name, 'IdProject': idProject });
        $('#containerItemSprintParent').remove();
        buildContainerCreatedSprintDetail(name, styleSprint);
    });
    $("#btnItemSprintRemove").on('click', function () {
        $('#containerItemSprintParent').remove();
        if ($('#containerSprintDetail').children().length === 0) {
            buildContainerMsgEmptySprintDetail();
            sprintCreated = true;
        }
    });
}

function buildContainerCreatedSprintDetail(name, style) {
    var context = {}, nodes = [], project, iProject,
        source = document.getElementById("temp-sprint-created-container").innerHTML,
        template = Handlebars.compile(source);
    incrementalAuxSprints++;
    context.name = name;
    context.style = style;
    context.id = incrementalAuxSprints;
    $('#containerSprintDetail').append(template(context));
    $('#mBtnGoToSprintDetail'.concat(incrementalAuxSprints)).on('click', function () {
        var $this = $(this), id = $this.attr('data-id');
        location.href = "/Project/Dashboard/".concat(id);
    });
}

function buildContainerCreatedSprintInitializeDetail(data, id) {
    var context = {}, nodes = [], project, iProject,
        source = document.getElementById("temp-sprint-created-container").innerHTML,
        template = Handlebars.compile(source), styleSprint;
    if (sprintCreated) {
        sprintCreated = false;
        $('#containerSprintDetail').empty();
    }
    context.name = data.name;
    context.id = id;
    if (colorsIncrementalAuxSprint === colorsTotalAux) {
        colorsIncrementalAuxSprint = 0;
    }
    styleSprint = 'style="background-color: '.concat(COLORS[colorsIncrementalAuxSprint]).concat(';')
        .concat(' color: #fff;"');
    context.style = styleSprint;
    colorsIncrementalAuxSprint++;
    $('#containerSprintDetail').append(template(context));
    $('#mBtnGoToSprintDetail'.concat(id)).on('click', function () {
        var $this = $(this), id = $this.attr('data-id');
        location.href = "/Project/Dashboard/".concat(id);
    });
}

function buildContainerMsgEmptySprintDetail() {
    var context = {}, nodes = [], project, iProject,
        source = document.getElementById("temp-sprints-empty-msg").innerHTML,
        template = Handlebars.compile(source);
    $('#containerSprintDetail').append(template(context));
}

function saveToDatabaseUserStoryDetail(obj) {
    var data = clone(obj);
    delete data.aux;
    console.log(data);
    $.ajax({
        url: "/Project/SaveUserStory",
        type: 'POST',
        data: { model: obj }
    }).done(function (e) {
        window.location.reload();
    });
}

function saveToDatabaseSprintDetail(obj) {
    console.log(obj);
    $.ajax({
        url: "/Project/CreateSprint",
        type: 'POST',
        data: { sprint: obj }
    }).done(function (e) {
        window.location.reload();
    });
}
