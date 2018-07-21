function ejectPageLoad() {
    $("#circle-progress").circleProgress({
        'value': 0.01,
        'fill': {'gradient': ['#ff1e41', '#ff5f43']}
    }).on('circle-animation-progress', function(event, progress, stepValue) {
        $(this).find('strong').html(Math.round(100 * stepValue) + '<i>%</i>');
    });

    for(var i=0;i<5;i++){
        updateProgress(i);
    }
}

function hide() {
    if(typeof gProjectMainReport !== 'undefined'){
        reAnimate(true, gProjectMainReport);
    }
    if(typeof gProjectDetailUSReport !== 'undefined'){
        reAnimate(true, gProjectDetailUSReport);
    }
    if(typeof gProjectDetailUSReportPie !== 'undefined'){
        reAnimate(true, gProjectDetailUSReportPie);
    }
    $("#circle-progress").hide();
    $("#circle-progress").remove();
    $("#block-page").addClass('hide');
    $("#block-page").remove();
    $('body').removeClass('scroll-hide');
}

function updateProgress(loaded) {
    var progressPerc = loaded / 4;
    $("#circle-progress").circleProgress('value', progressPerc);
    if (loaded === 4) {
        setTimeout(function() {
            hide(true);
        }, 2000);
    }
}
