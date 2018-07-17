var projects = [];

function initialize(){
    preparePage();
    activeNavHeader();
    //getProjects();
    
}

function activeNavHeader(){
    $('#liViewProjects').addClass("active");
}

function preparePage(){
    $('#main_wrapper').addClass('not-scroll-page');
}

//function getProjects(){
//    var URI = "";
//    URI = "http://localhost:10519/api/listAllProjectAsync/{idUser}";
//    $.ajax({
//        'url': URI,
//        'data':'9JOxHBVUIHN3pTv2d648cNO13lD3',
//        'contentType': "application/json",
//        'dataType': "json",
//        'type': "POST",
//        'cache': true,
//        'async': true
//    }).done(function(data, textStatus, jqXHR) {
//        projects = data.Data;
//        //buildContainersForProjects(projects);
//    }).fail(function(jqXHR, textStatus, errorThrown) {
//        console.log(jqXHR);
//        console.log(textStatus);
//        console.log(errorThrown);
//    });
//}

//function buildContainersForProjects(data) {
//    console.log(data);
//    //debugger;
//    var context = {}, nodes = [], project, iProject,
//        source = document.getElementById("temp-list-projects").innerHTML,
//        template = Handlebars.compile(source);
//    for(iProject in data){
//        project = data[iProject];
//        nodes.push({'name': project.Name, 'id': project.Uid});
//    }
//    context.projects = nodes;
//    $('#containerProjects').html(template(context));
//}