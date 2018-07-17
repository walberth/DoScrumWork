//var sResponsibleTaskValid = true, incrementalAuxUserStories = 0, select2Val = {'id': null, 'text': null},
//    RESOURCES = {
//        'select2': "Seleccione",
//        'modal': {
//            'create': {
//                'title': "Crear Historia de Usuario", 'button': "Crear", 'action': "create"
//            },
//            'update': {
//                'title': "Editar Historia de Usuario", 'button': "Actualizar", 'action': "update"
//            }
//        }
//    },
//    COLORS = ['#00a65a', '#f39c12', '#00c0ef', '#3c8dbc', '#dd4b39', '#b32d00', '#ff8c1a', '#99cc00',
//            '#9900cc', '#663300'],
//    colorsIncrementalAux = 0, colorsTotalAux = COLORS.length - 1, dataResponsibles = [], userStories = {},
//    itemUserStoryAux = {}, $select;

//function initialize(){
//    activeNavHeader();
//    buildDatesComponent($('#iDatesProject'), '#containerDates');
//    initializeEvents();
//    getAllResponsibles();
//}

//function activeNavHeader(){
//    $('#liCreateProject').addClass("active");
//}

//function initializeEvents(){
    
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
//                'Name': $('#iNameTask').val(), 'Description': $('#taDescriptionTask').val(),
//                'IdUserResponsable': select2Val.id, 'UserResponsable': select2Val.text,
//                'Effort': $('#iEffortTask').val(), 'Priority': $('#iPriorityTask').val(),
//                'AcceptanceCriteria': $('#taCriteriaOfAcceptanceTask').val(), 'aux': incrementalAuxUserStories.toString()
//            };
//            buildContainerUserStory(userStories[incrementalAuxUserStories.toString()], incrementalAuxUserStories.toString());
//        } else if(action === 'update'){
//            userStories[itemUserStoryAux.aux].Name = $('#iNameTask').val();
//            userStories[itemUserStoryAux.aux].Description = $('#taDescriptionTask').val();
//            userStories[itemUserStoryAux.aux].IdUserResponsable = select2Val.id;
//            userStories[itemUserStoryAux.aux].UserResponsable = select2Val.text;
//            userStories[itemUserStoryAux.aux].Effort = $('#iEffortTask').val();
//            userStories[itemUserStoryAux.aux].Priority = $('#iPriorityTask').val();
//            userStories[itemUserStoryAux.aux].AcceptanceCriteria = $('#taCriteriaOfAcceptanceTask').val();
//            $('#nameItemUserStory'.concat(itemUserStoryAux.aux)).text($('#iNameTask').val());
//        }
//    });
//    $("#btnCreateProject").click(function(){
//        var data = {}, dateParams = getDateParameters(), iNode, node;
//        data.Name = $('#iNameProject').val();
//        data.Description = $('#taDescriptionProject').val();
//        data.StartDate = dateParams.startDate;
//        data.EndDate = dateParams.endDate;
//        data.userStories = [];
//        for(iNode in userStories){
//            node = userStories[iNode];
//            data.userStories.push({
//                'Name': node.Name, 'Description': node.Description,
//                'IdUserResponsable': node.IdUserResponsable, 'UserResponsable': node.UserResponsable,
//                'Effort': node.Effort, 'Priority': node.Priority,
//                'AcceptanceCriteria': node.AcceptanceCriteria
//            });
//        }
//        console.log(data);
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
//    var URI = "";
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
//        $('#taskModalTitle').text(RESOURCES.modal.update.title);
//        $('#mActionTask').text(RESOURCES.modal.update.button);
//        $('#mActionTask').attr('data-action', RESOURCES.modal.update.action);
//        updateFormUserStoryModal(itemUserStoryAux);
//    });
//    $("#mBtnRemoveUserStory".concat(id)).on('click', function(){
//        var $this = $(this), id = $this.attr('data-id');
//        $('#containerItemUserStory'.concat(id)).remove();
//        delete userStories[id];
//        if(Object.keys(userStories).length === 0){
//            buildContainerMsgUserStory();
//        }
//        console.log(userStories);
//    });
//}

//function buildContainerMsgUserStory(){
//    var context = {}, nodes = [], project, iProject,
//        source = document.getElementById("temp-user-story-msg").innerHTML,
//        template = Handlebars.compile(source);
//    $('#containerUserStoriesDetail').append(template(context));
//    userStoriesActionValid = true;
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
