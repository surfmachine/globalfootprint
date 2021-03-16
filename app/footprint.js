// ====================================================================================================================
// Footprint Javascript
// ====================================================================================================================

//
// chart counts
//
let DEFAULT_CHART_COUNT = 180;
let REGION_CHART_COUNT  = 187;

//
// chart size, visibility and colors
//

// The size settings for small, medium and large charts (including rectangle setup)
let sSize  = {'class':'small', 'width': 120, 'height':  60, 'top': 24, 'bottom': 10, 'left': 10, 'right': 10, 'xTicks': 4, 'yTicks': 1, 'yTitleOffset':10, 'ySubtitleOffset':18, 'nr': 1};
let mSize  = {'class':'medium','width': 240, 'height': 120, 'top': 40, 'bottom': 20, 'left': 20, 'right': 20, 'xTicks': 6, 'yTicks': 3, 'yTitleOffset':16, 'ySubtitleOffset':30, 'nr': 2};
let lSize  = {'class':'large', 'width': 440, 'height': 220, 'top': 60, 'bottom': 30, 'left': 30, 'right': 30, 'xTicks': 7, 'yTicks': 5, 'yTitleOffset':20, 'ySubtitleOffset':60, 'nr': 3};

// The visibility settings for small, medium and large charts
let sVis   = {'titel': true, 'subtitle': false, 'threshold': false, 'xAxis': false,'yAxis': false};
let mVis   = {'titel': true, 'subtitle': false, 'threshold': false, 'xAxis': true, 'yAxis': true };
let lVis   = {'titel': true, 'subtitle': false, 'threshold': false, 'xAxis': true, 'yAxis': true };

// The stroke color settings for the different chart modes 'clean', 'diff' and 'fill' and the threshold
let strokeColors = {
    'threshold': 'grey',
    'clean'    : 'black',
    'diff'     : {'bellow':'#0b4d94', 'above':'crimson' },
    'fill'     : {'bellow':'#0b4d94', 'above':'crimson' }
};

let regionStyle = "border: 1px solid #888888;";

//
// The option controls
//
let chartHist = {'id':'histChart', 'value':'hist', 'label':'Over time', 'checked':'' };
let chartCurr = {'id':'currChart', 'value':'curr', 'label':'Current', 'checked':'checked' };
let chartOpt  = {'title':'Chart', 'name':'chart', 'items':[chartCurr, chartHist] }

let sizeSmall  = {'id':'sSize', 'value':'s', 'label':'S', 'checked':'checked' };
let sizeMedium = {'id':'mSize', 'value':'m', 'label':'M', 'checked':'' };
let sizeLarge  = {'id':'lSize', 'value':'l', 'label':'L', 'checked':'' };
let sizeOpt    = {'title':'Size', 'name':'size', 'items':[sizeSmall, sizeMedium, sizeLarge ] }

let cleanMode  = {'id':'cleanMode', 'value':'clean', 'label':'Plain', 'checked':'' };
let diffMode   = {'id':'diffMode',  'value':'diff',  'label':'Diff',  'checked':'' };
let fillMode   = {'id':'fillMode',  'value':'fill',  'label':'Fill',  'checked':'checked' };
let modeOpt    = {'title':'Mode', 'name':'mode', 'items':[cleanMode, diffMode, fillMode ] }

let relScale   = {'id':'relScale', 'value':'rel', 'label':'Individual', 'checked':'checked' };
let absScale   = {'id':'absScale', 'value':'abs', 'label':'Compare', 'checked':'' };
let scaleOpt   = {'title':'Scale', 'name':'scale', 'items':[relScale, absScale ] }

let abcOrder   = {'id':'abcOrder',   'value':'abc',   'label':'A-Z',  'checked':'checked' };
let bestOrder  = {'id':'bestOrder',  'value':'best',  'label':'Best', 'checked':'' };
let worstOrder = {'id':'worstOrder', 'value':'worst', 'label':'Worst','checked':'' };
let regionOrder= {'id':'regionOrder','value':'region','label':'Region','checked':'' };
let orderOpt   = {'title':'Order', 'name':'order', 'items':[abcOrder, bestOrder, regionOrder ] }

let barColor   = {'id':'barColor', 'value':'bar', 'label':'Accessible', 'checked':'checked' }; // barrier-free
let sigColor   = {'id':'sigColor', 'value':'sig', 'label':'Signal',     'checked':'' };
let colorOpt   = {'title':'Color', 'name':'color', 'items':[barColor, sigColor] };

// --------------------------------------------------------------------------------------------------------------------
// main
// --------------------------------------------------------------------------------------------------------------------

// append option controls
appendControls();

// render
render();

// --------------------------------------------------------------------------------------------------------------------
// handlers and render countries
// --------------------------------------------------------------------------------------------------------------------

/**
 * The handler of the option changes.
 */
function handleOptionClick(e) {
    render();
}

/**
 * Evaluate options and render site.
 */
function render() {
    // init options
    let chartOptions = selectChartOptions();
    let chartCount   = selectChartCount(chartOptions);

    // set header subtitle
    setHeaderSubtitle(chartOptions.subtitle)
    setControlsVisibility(chartOptions.chart)

    // append chart elements
    appendChartElements(chartCount, chartOptions.size.class)

    // render countries
    renderCountries(chartCount, chartOptions);
}

/**
 * Render all countries.
 *
 * @param count The number of charts.
 * @param chart The chart options.
 */
function renderCountries(count, chart) {

    let file = "data/number-of-earth-all.json";

    if (chart.chart == "hist") {
        if (chart.order == "best") {
            file = "data/number-of-earth-all-best-avg.json";
        } else if (chart.order == "worst") {
            file = "data/number-of-earth-all-worst-avg.json";
        } else if (chart.order == "region") {
            file = "data/number-of-earth-all-region.json";
        }
    } else {
        if (chart.order == "best") {
            file = "data/number-of-earth-all-best.json";
        } else if (chart.order == "worst") {
            file = "data/number-of-earth-all-worst.json";
        } else if (chart.order == "region") {
            file = "data/number-of-earth-all-region.json";
        }
    }

    d3.json(file, function (data) {
        // d3.json("data/number-of-earth-world.json", function (data){
        for (let i = 0; i < count; i++) { // 0..9
            id = "#chart" + i;
            country = data.countries[i]

            // add border to the region charts
            if (chart.order == "region") {
                if (country.region.chart) {
                    d3.select(id).attr("style", regionStyle);
                }
            }

            // render charts
            if (chart.chart == 'hist') {
                renderCountry(id, country, chart);
            } else {
                renderCountryRec(id, country, chart);
            }

        }
    })
}


// --------------------------------------------------------------------------------------------------------------------
// elements
// --------------------------------------------------------------------------------------------------------------------

/**
 * The number of charts to display.
 * @return {number}
 */
function selectChartCount(chartOptions) {

    if (chartOptions.order == 'region') {
        return REGION_CHART_COUNT;
    }

    return DEFAULT_CHART_COUNT;
}

/**
 * Append the div elements for the single charts.
 * @param chartCount The number of charts from 0..n-1
 * @param chartSize  The chart size ['large', 'medium', 'small']
 */
function appendChartElements(chartCount, chartSize) {
    for (i=0; i<chartCount; i++) {
        let id = "chart" + i;
        let elem = null;

        if (chartSize == 'small') {
            elem = "<div id=\"" + id + "\" class=\"col-xxl-1 col-xl-2 col-lg-2 col-sm-3 col-4 d-flex justify-content-center\"></div>"

        } else if (chartSize == 'medium') {
            elem = "<div id=\"" + id + "\" class=\"col-xxl-2 col-xl-3 col-lg-4 col-md-4 col-sm-6 col-12 d-flex justify-content-center\"></div>"

        } else {
            elem = "<div id=\"" + id + "\" class=\"col-xxl-4 col-xl-6  col-lg-6  col-md-12 col-12 d-flex justify-content-center\"></div>"
        }

        $("#"+id).remove();
        $("#charts").append(elem);
    }

    // clean up region charts if switched to default count
    if (chartCount == DEFAULT_CHART_COUNT) {

        for (i=chartCount; i<REGION_CHART_COUNT; i++) {
            let id = "chart" + i;
            $("#"+id).remove();
        }
    }


}

function setHeaderSubtitle(subtitle) {
    $("#headerSubtitleText").text(subtitle);
}

function setControlsVisibility(chart) {

    if (chart == 'hist') {
        $("#scale").css({ visibility: "visible"})

    } else {
        $("#scale").css({ visibility: "hidden"})
    }
}


function appendControls() {
    let elems = [];

    elems.push( createOption(chartOpt) )
    elems.push( createOption(modeOpt) )
    elems.push( createOption(orderOpt) )
    elems.push( createOption(sizeOpt) )
    elems.push( createOption(scaleOpt) )
    // elems.push( createOption(colorOpt) )

    // append controls
    $("div.control").append(elems.join(""));
}

/**
 * Create a grid element with an option.
 *
 * @param option The option record with: {title, name, items} where items is a list of:{id, value, label, checked}
 * @returns The html option element.
 */
function createOption(option) {
    let buf = [];

    buf.push("<div id=\"" + option.name + "\"  class=\"form-check form-check-inline controlGroup col col-md-auto \">")
    buf.push("<div class=\"form-check form-check-inline controlTitle\">" + option.title + "</div>");
    option.items.forEach(function (item) {
        buf.push(createOptionItem(option.name, item))
    });
    buf.push("</div>");

    return buf.join("");
}

/**
 * Create a single option item.
 *
 * @param name The name of the option (all option of a group have the same name).
 * @param item The item: {id, value, label, checked}
 * @returns The html option element item.
 */
function createOptionItem(name, item) {
    let buf = [];

    buf.push("<div class=\"form-check form-check-inline controlPair\">");
    buf.push("<input id=\"" + item.id + "\" class=\"form-check-input\" type=\"radio\" name=\"" + name + "\" value=\"" + item.value + "\" onclick=\"handleOptionClick(this)\"" + item.checked + ">");

    buf.push("<label class=\"form-check-label\" for=\"" + item.id + "\">" + item.label + "</label>");
    buf.push("</div>");

    return buf.join("");
}

// --------------------------------------------------------------------------------------------------------------------
// chart options
// --------------------------------------------------------------------------------------------------------------------

/**
 * The chart options to control the mode, scale, size, visibility and colors of the chart.
 *
 * - chart    : ['hist', 'current']
 * - subtitle : 'the current subtitle accorging the selected chart'
 * - mode     : ['clean', 'diff', 'fill']
 * - order    : ['abc', 'best', 'region']
 * - scale    : ['abs', 'rel']
 * - size     : {class, width, height, xTicks, yTicks, ySubtitleOffset} with class: ['large', 'medium', 'small']
 * - vis      : {title, subtitle, threshold, xAxis, yAxis}
 * - col      : {...} the stroke colors for the modes clean, diff and fill as well as the threshold
 */
function selectChartOptions() {

    let chart = {'chart': 'hist', subtitle: '', 'mode': null, 'order': null, 'scale': null, 'size': null, 'vis':null, 'col': strokeColors }

    // set chart
    if (document.getElementById("histChart").checked ) {
        chart.chart = "hist";
        chart.subtitle = "Number of earth per year"
    } else {
        chart.chart = "current";
        chart.subtitle = "Number of earth 2017"
    }

    // set size
    if ( document.getElementById("lSize").checked ) {
        chart.size = lSize;
        chart.vis = lVis;
    } else if ( document.getElementById("mSize").checked ) {
        chart.size = mSize;
        chart.vis = mVis;
    } else {
        chart.size = sSize;
        chart.vis = sVis;
    }

    // set axis visibility
    // if ( document.getElementById("trueAxis").checked ) {
    //     chart.vis.xAxis = true;
    //     chart.vis.yAxis = true;
    // } else if ( document.getElementById("falseAxis").checked ) {
    //     chart.vis.xAxis = false;
    //     chart.vis.yAxis = false;
    // }

    // set mode
    if ( document.getElementById("cleanMode").checked ) {
        chart.mode = "clean";
    } else if ( document.getElementById("diffMode").checked ) {
        chart.mode = "diff";
    } else {
        chart.mode = "fill";
    }

    // set scale
    if ( document.getElementById("absScale").checked ) {
        chart.scale = "abs";
    } else {
        chart.scale = "rel";
    }

    // set order
    if ( document.getElementById("abcOrder").checked ) {
        chart.order = "abc";
    } else if ( document.getElementById("bestOrder").checked ) {
        chart.order = "best";
    // } else if ( document.getElementById("worstOrder").checked ) {
    //    chart.order = "worst"
    } else {
        chart.order = "region";
    }

    // set color
    // if ( document.getElementById("barColor").checked ) {
    //     chart.col.diff.bellow = "#0b4d94";
    //     chart.col.fill.bellow = "#0b4d94";
    // } else {
    //     chart.col.diff.bellow = "#008000";
    //     chart.col.fill.bellow = "#008000";
    // }

    // return chart options
    return chart;
}

// --------------------------------------------------------------------------------------------------------------------
// number of earth line chart
// --------------------------------------------------------------------------------------------------------------------

/**
 * Render a single country.
 *
 * @param id      The id of the html element (id) to append the chart
 * @param country The country dict: {country, year, value, data}
 * @param chart   The chart options.
 */
function renderCountry(id, country, chart) {

    //
    // setup
    //

    // init country data
    let title  = country.country;
    let xYear  = country.year;
    let yValue = country.value;
    let data   = country.data;

    // init chart data
    let subtitle = "Number of earth per year";
    let absAxis  = chart.scale == "abs";

    // set the dimensions and margins of the graph
    var margin = {top: chart.size.top, right: chart.size.right, bottom: chart.size.bottom, left: chart.size.left},
        width  = chart.size.width  - margin.left - margin.right,
        height = chart.size.height - margin.top  - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select(id)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //
    // title & subtitle
    //
    if (chart.vis.titel) {
        svg.append("text")
            .attr("y", 0 - margin.top + chart.size.yTitleOffset)
            .attr("x",(width / 2))
            .attr("dy", "1em")
            .attr("class", "title " + chart.size.class)
            .style("text-anchor", "middle")
            .text(title);
    }

    if (chart.vis.subtitle) {
        svg.append("text")
            .attr("y", 0 - margin.top + chart.size.ySubtitleOffset)
            .attr("x",(width / 2))
            .attr("dy", "1em")
            .attr("class", "subtitle " + chart.size.class)
            .style("text-anchor", "middle")
            .text(subtitle);
    }


    //
    // x-axis
    //
    let xStart = absAxis ? xYear.min : xYear.from;
    let xEnd   = absAxis ? xYear.max : xYear.to;

    var x = d3.scaleLinear()
        .domain([xStart, xEnd])
        .range([ 0, width ])
        .nice();

    var xAxis = d3.axisBottom(x)
        .ticks(chart.size.xTicks)
        .tickFormat(d3.format("0.4")) ;   // .tickFormat(x => `${x.toFixed(0)}`)

    if (chart.vis.xAxis) {
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .attr("class", "xAxis " + chart.size.class)
            .call(xAxis);
    }

    //
    // y-axis (0 to yEnd where yEnd is at least 1)
    //
    let yStart = yValue.min;
    let yEnd   = absAxis ? yValue.max : (yValue.to > 1 ? yValue.to : 1);

    var y = d3.scaleLinear()
        .domain([yStart, yEnd])
        .range([ height, 0 ])
        .nice();

    var yAxis = d3.axisLeft(y)
        .ticks(chart.size.yTicks);

    if (chart.vis.yAxis) {
        svg.append("g")
            .attr("class", "yAxis " + chart.size.class)
            .call(yAxis);
    }

    //
    // prepare diff and fill mode chart data
    //
    let fillData = [];
    let bellowFlag = data[0].value < 1;
    let fillRec = {'bellowFlag': bellowFlag, 'data': []};
    for (i = 0; i < data.length; i++) {
        bellowFlag = data[i].value < 1;
        if (bellowFlag == fillRec.bellowFlag) {
            fillRec.data.push(data[i])
        } else {
            thresholdRec = {'year': data[i].year - 0.5, 'value':1}
            fillRec.data.push(thresholdRec);
            fillData.push(fillRec);
            fillRec = {'bellowFlag': bellowFlag, 'data': []};
            fillRec.data.push(thresholdRec);
            fillRec.data.push(data[i])
        }
    }
    if (fillRec.data.length > 0) {
        fillData.push(fillRec);
    }

    //
    // line chart path rendering
    //
    if (chart.vis.threshold && yEnd >= 1 || chart.mode == "clean") {
        thresholdData = [{'year': xYear.from, 'value':1}, {'year': xYear.to, 'value':1}]
        renderPath(svg, x, y, thresholdData, {'fill': "none", 'stroke': chart.col.threshold, 'strokeWidth': 0.6});
    }

    if (chart.mode == "clean") {
        renderPath(svg, x, y, data, {'fill': "none", 'stroke': chart.col.clean, 'strokeWidth': 2.0});

    } else if (chart.mode == "diff") {
        for (i=0; i<fillData.length; i++) {
            fillRec = fillData[i];
            col = fillRec.bellowFlag ?  chart.col.diff.bellow : chart.col.diff.above;
            renderPath(svg, x, y, fillRec.data, {'fill': "none",  'stroke': col,  'strokeWidth': 2.0});
        }

    } else if (chart.mode == "fill") {
        for (i=0; i<fillData.length; i++) {
            fillRec = fillData[i];
            if (i==0) {
                fillRec.data.unshift({'year': fillRec.data[0].year, 'value':1});
            }
            if (i==fillData.length-1) {
                fillRec.data.push({'year': fillRec.data[fillRec.data.length-1].year, 'value':1});
            }
            col  = fillRec.bellowFlag ?  chart.col.fill.bellow : chart.col.fill.above;
            renderPath(svg, x, y, fillRec.data, {'fill': col,  'stroke': col,  'strokeWidth': 2.0});
        }
    }
}

/**
 * Render a path with the given data and options.
 *
 * @param svg  The svg to append the rendered the path.
 * @param x    The x domain value mapping function
 * @param y    The y domain value mapping function
 * @param data The data records as list of dict: [{year, value}, ...]
 * @param opt  The options as dict: {fillColor, strokeColor, strokeWidth}
 */
function renderPath(svg, x, y, data, opt) {
    svg.append("path")
        .datum(data)
        .attr("fill", opt.fill)
        .attr("stroke", opt.stroke)
        .attr("stroke-width", opt.strokeWidth)
        .attr("d", d3.line()
            .x(function(d) { return x(d.year) })
            .y(function(d) { return y(d.value) })
        );
}

// --------------------------------------------------------------------------------------------------------------------
// number of earth rectangle chart
// --------------------------------------------------------------------------------------------------------------------

/**
 * Render a single country.
 *
 * @param id      The id of the html element (id) to append the chart
 * @param country The country dict: {country, year, value, data}
 * @param chart   The chart options.
 */
function renderCountryRec(id, country, chart) {

    //
    // init
    //

    // init country data
    let title  = country.country;
    let xYear  = country.year;
    let yValue = country.value;
    let data   = country.data;
    let rec   = data[data.length-1];
    let year  = rec.year;
    let value = parseFloat(rec.value).toFixed(2);;

    // init chart data
    var margin = {top: chart.size.top, right: chart.size.right, bottom: chart.size.bottom, left: chart.size.left},
        width  = chart.size.width  - margin.left - margin.right - 24,
        height = chart.size.height - margin.top  - margin.bottom;


    // append the svg object to the body of the page
    var svg = d3.select(id)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    //
    // title
    //
    if (chart.vis.titel) {
        svg.append("text")
            .attr("y", 0 - margin.top + chart.size.yTitleOffset)
            .attr("x",(width / 2))
            .attr("dy", "1em")
            .attr("class", "title " + chart.size.class)
            .style("text-anchor", "middle")
            .text(title);
    }

    if (chart.vis.subtitle) {
        svg.append("text")
            .attr("y", 0 - margin.top + chart.size.ySubtitleOffset)
            .attr("x",(width / 2))
            .attr("dy", "1em")
            .attr("class", "subtitle " + chart.size.class)
            .style("text-anchor", "middle")
            .text(subtitle);
    }


    //
    // rectangle
    //
    let stroke = "none";
    let fill   = "none";

    if (chart.mode == "clean") {
        renderValue(svg, width, height, chart, value);

    } else if (chart.mode == "diff") {
        stroke = (value <=1 ? chart.col.diff.bellow : chart.col.diff.above);
        renderRectangleRough(svg, width, height, stroke, fill, chart, value);
        renderValueDiff(svg, width, height, chart, value, stroke);

    } else if (chart.mode == "fill") {
        fill = (value <=1 ? chart.col.fill.bellow : chart.col.fill.above)
        renderRectangleRough(svg, width, height, stroke, fill, chart, value);
    }
}

function renderRectangle(svg, width, height, stroke, fill) {
    svg.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", width)
        .attr("height", height)
        .attr("stroke", stroke)
        .attr("fill", fill);
}

function renderRectangleRough(svg, width, height, stroke, fill, chart, value) {
    const factor = (value > 1 ? value : (1-value) * 6);
    const rc = rough.svg(svg);

    // Variante rough
    // let node= rc.rectangle(0, 0, width, height,
    //     {stroke: stroke, strokeWidth: chart.size.nr, roughness: chart.size.nr, fill: fill, fillWeight: chart.size.nr * factor, fillStyle: "hachure"});

    let node= rc.rectangle(0, 1, width, height,
        {stroke: stroke, strokeWidth: chart.size.nr, roughness: 0, bowing: 0, fill: fill, fillWeight: chart.size.nr * factor, fillStyle: "hachure"});

    svg.selectAll("g")
        .data([1])
        .enter()
        .append("g")
        .append((d) => node);
}

function renderValueDiff(svg, width, height, chart, value, fill) {
    let textSizeClass = evalTextSizeClass(value);

    svg.append("text")
        .attr("y", 0 + (height/2 - chart.size.ySubtitleOffset/2))
        .attr("x",(width / 2))
        .attr("dy", "1em")
        .attr("class", "value " + chart.size.class)
        .style("text-anchor", "middle")
        .style("fill", fill)
        .text(value);
}

function renderValue(svg, width, height, chart, value) {
    let textSizeClass = evalTextSizeClass(value);

    svg.append("text")
        .attr("y", 0 + (height/2 - chart.size.ySubtitleOffset/2))
        .attr("x",(width / 2))
        .attr("dy", "1em")
        .attr("class", "value " + chart.size.class + " " + textSizeClass)
        .style("text-anchor", "middle")
        .text(value);
}

function evalTextSizeClass(value) {

    if (value <= 0.7) {
        return "a";
    } else if (value <= 1.0) {
        return "b";
    } else if (value <= 1.5) {
        return "c";
    } else if (value <= 2.0) {
        return "d";
    } else if (value <= 3.0) {
        return "e";
    }

    return "f";
}


// ====================================================================================================================
// The end.