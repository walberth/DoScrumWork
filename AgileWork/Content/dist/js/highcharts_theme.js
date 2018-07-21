Highcharts.createElement('link', {
    'href': 'http://fonts.googleapis.com/css?family=Dosis:400,600',
    'rel': 'stylesheet',
    'type': 'text/css'
}, null, document.getElementsByTagName('head')[0]);

Highcharts.theme = {
    'chart': {
        'backgroundColor': '#ffffff'
    },
    'title': {
        'style': {
            'fontSize': '14px',
            'fontWeight': 'bold',
            'textTransform': 'uppercase'
        }
    },
    'legend': {
        'itemStyle': {
            'fontSize': '12px'
        }
    },
    'xAxis': {
        'gridLineWidth': 1,
        'labels': {
            'style': {
                'fontSize': '12px'
            }
        }
    },
    'yAxis': {
        'minorTickInterval': 'auto',
        'labels': {
            'style': {
                'font': '11px Trebuchet MS, Verdana, sans-serif'
            }
        },
        'title': {
            'style': {
                'color': '#333',
                'fontWeight': 'bold',
                'fontSize': '12px',
                'fontFamily': 'Trebuchet MS, Verdana, sans-serif'
            }
        }
    },
    'plotOptions': {
        'candlestick': {
            'lineColor': '#404048'
        }
    },
    'background2': '#F0F0EA'
};

var colorsTheme = {
    'BLUE': "#4572A7", 'RED': "#AA4643", 'GREEN': "#89A54E", 'PURPLE': "#80699B", 'TURQUOISE': "#3D96AE", 'ORANGE': "#DB843D",
    'PASTEL_BLUE': "#92A8CD", 'GROUND': "#A47D7C", 'OLIVE': "#B5CA92"
};

Highcharts.setOptions({
    'colors': [colorsTheme.BLUE, colorsTheme.RED, colorsTheme.GREEN, colorsTheme.PURPLE, colorsTheme.TURQUOISE,
        colorsTheme.ORANGE, colorsTheme.PASTEL_BLUE, colorsTheme.GROUND, colorsTheme.OLIVE],
    'lang': {
        'printChart': 'Imprimir Gr\u00E1fica',
        'downloadPNG': 'Descargar PNG',
        'downloadJPEG': 'Descargar JPEG',
        'downloadSVG': 'Descargar SVG',
        'contextButtonTitle': 'Men\u00FA de Exportaci\u00F3n',
        'downloadCSV': 'Descargar CSV',
        'downloadXLS': 'Descargar XLS',
        'downloadPDF': 'Descargar PDF',
        'noData': "No Data"
    }
});

Highcharts.Series.prototype.afterAnimate = function() {
};

Highcharts.seriesTypes.pie.prototype.afterAnimate = function() {
    this.setClip();
    Highcharts.fireEvent(this, 'afterAnimate');
};

function reAnimate(fromStart, chart) {
    // store animation:
    var seriesAnimate = function(init) {
        var series = this,
                chart = series.chart,
                clipRect,
                animation = Highcharts.animObject(series.options.animation),
                sharedClipKey;
        // Initialize the animation. Set up the clipping rectangle.
        if (init) {
            series.setClip(animation);
            // Run the animation
        } else {
            sharedClipKey = this.sharedClipKey;
            clipRect = chart[sharedClipKey];
            if (clipRect) {
                clipRect.attr({
                    width: 0
                });
                clipRect.animate({
                    width: chart.plotSizeX + 99
                }, animation);
            }
            if (chart[sharedClipKey + 'm']) {
                chart[sharedClipKey + 'm'].attr({
                    width: 0
                })
                chart[sharedClipKey + 'm'].animate({
                    width: chart.plotSizeX + 99
                }, animation);
            }
        }
    };

    var columnAnimate = function(init) {
        var series = this,
                yAxis = this.yAxis,
                options = series.options,
                extend = Highcharts.extend,
                svg = Highcharts.svg,
                inverted = this.chart.inverted,
                animObject = Highcharts.animObject,
                attr = {},
                translatedThreshold;

        if (svg) { // VML is too slow anyway
            attr.scaleY = 0.001;
            translatedThreshold = Math.min(yAxis.pos + yAxis.len, Math.max(yAxis.pos, yAxis.toPixels(options.threshold)));
            if (inverted) {
                attr.translateX = translatedThreshold - yAxis.len;
            } else {
                attr.translateY = translatedThreshold;
            }
            series.group.attr(attr);
            attr[inverted ? 'translateX' : 'translateY'] = yAxis.pos;
            series.group.animate(attr, extend(animObject(series.options.animation), {
                // Do the scale synchronously to ensure smooth updating (#5030)
                step: function(val, fx) {
                    series.group.attr({
                        'scaleY': Math.max(0.001, fx.pos) // #5250
                    });
                }
            }));

            // delete this function to allow it only once
            series.animate = null;
        }
    };
    var pieAnimate = Highcharts.seriesTypes.pie.prototype.animate,
            c = chart;
    // run animation again: tested with line chart only
    Highcharts.each(c.series, function(s) {
        if (animation && !isObject(animation)) {
            animation = defaultPlotOptions[series.type].animation;
        }
        var options = s.options,
                animation = options.animation,
                clipBox = s.clipBox || c.clipBox,
                sharedClipKey = ['_sharedClip', animation && animation.duration, animation && animation.easing, clipBox.height, options.xAxis, options.yAxis].join(',');
        clipRect = c[sharedClipKey],
                markerClipRect = c[sharedClipKey + ',m'];
        if (fromStart) {
            if (clipRect) {
                clipRect.attr({
                    'width': 0
                });
            }
            if (markerClipRect) {
                markerClipRect.attr({
                    'width': 0
                });
            }
        }
        s.animate = s.type == 'pie' ? pieAnimate : (s.type == 'column' ? columnAnimate : (s.type == 'bar' ? columnAnimate : seriesAnimate));
        //s.animate(true);
        s.animate();
    });
}

function isObject(obj) {
    return obj && typeof obj === 'object';
}

// Apply the theme
Highcharts.setOptions(Highcharts.theme);
