
// ====================================================================================================================
// main
// ====================================================================================================================

// The size settings for small, medium and large charts
let sSize  = {'class':'small', 'width': 120, 'height':  60, 'top': 30, 'bottom': 15, 'left': 10, 'right': 10, 'xTicks': 4, 'yTicks': 1, 'yTitleOffset':10, 'ySubtitleOffset':18, 'nr': 1};
let mSize  = {'class':'medium','width': 240, 'height': 120, 'top': 40, 'bottom': 20, 'left': 20, 'right': 20, 'xTicks': 6, 'yTicks': 3, 'yTitleOffset':16, 'ySubtitleOffset':30, 'nr': 2};
let lSize  = {'class':'large', 'width': 440, 'height': 220, 'top': 60, 'bottom': 30, 'left': 30, 'right': 30, 'xTicks': 7, 'yTicks': 5, 'yTitleOffset':20, 'ySubtitleOffset':60, 'nr': 3};

// The visibility settings for small, medium and large charts
let sVis   = {'titel': true, 'subtitle': false, 'threshold': false, 'xAxis': false,'yAxis': false};
let mVis   = {'titel': true, 'subtitle': false, 'threshold': false, 'xAxis': true, 'yAxis': true };
let lVis   = {'titel': true, 'subtitle': false, 'threshold': false, 'xAxis': true, 'yAxis': true };

// The stroke color settings for the different chart modes 'clean', 'diff' and 'fill' and the threshold
let strokeColors = {
    'threshold': 'black',
    'clean'    : 'steelblue',
    'diff'     : {'bellow':'green', 'above':'crimson' },
    'fill'     : {'bellow':'green', 'above':'crimson' },
    'palette'  : {'bellow':["#edf8e9","#bae4b3","#74c476","#31a354","#006d2c"], 'above':["#fee5d9","#fcae91","#fb6a4a","#de2d26","#a50f15"] }
};

// init options
let chartCount = selectChartCount();
let chartOptions = selectChartOptions();

// append chart elements
appendChartElements(chartCount, chartOptions.size.class)

// render countries
renderCountries(chartCount, chartOptions);

// --------------------------------------------------------------------------------------------------------------------
// handlers
// --------------------------------------------------------------------------------------------------------------------

/**
 * The handler of the option changes.
 */
function handleOptionClick(e) {
    let chartCount = selectChartCount();
    let chartOptions = selectChartOptions();

    appendChartElements(chartCount, chartOptions.size.class)
    // d3.selectAll("svg").remove();

    renderCountries(chartCount, chartOptions);
}

/**
 * Render all countries.
 *
 * @param count The number of charts.
 * @param chart The chart options.
 */
function renderCountries(count, chart) {
    d3.json("data/number-of-earth-all.json", function (data) {
        // d3.json("data/number-of-earth-world.json", function (data){
        for (let i = 0; i < count; i++) { // 0..9
            id = "#chart" + i;
            country = data.countries[i]

            renderCountryRec(id, country, chart);
        }
    })
}

// --------------------------------------------------------------------------------------------------------------------
// chart elements and options
// --------------------------------------------------------------------------------------------------------------------

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
}


/**
 * The number of charts to display.
 * @return {number}
 */
function selectChartCount() {
    return 180;
}


/**
 * The chart options to control the mode, scale, size, visibility and colors of the chart.
 *
 * - mode : ['clean', 'diff', 'fill']
 * - scale: ['abs', 'rel']
 * - size : {class, width, height, xTicks, yTicks, ySubtitleOffset} with class: ['large', 'medium', 'small']
 * - vis  : {title, subtitle, threshold, xAxis, yAxis}
 * - col  : {...} the stroke colors for the modes clean, diff and fill as well as the threshold
 */
function selectChartOptions() {
    // init
    let chart = {'mode': null, 'scale': null, 'size': null, 'vis':null, 'col': strokeColors }

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

    // return chart options
    return chart;
}


// --------------------------------------------------------------------------------------------------------------------
// number of earth - history
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
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

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
 * @param opt  The options as dict: {fill, stroke, strokeWidth}
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
// number of earth - current
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
        width  = chart.size.width  - margin.left - margin.right - 12,
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
    // rectangle
    //
    let stroke = "none";
    let fill   = "none";

    if (chart.mode == "clean") {
        renderValue(svg, width, height, chart, value);

    } else if (chart.mode == "diff") {
        stroke = (value <=1 ? chart.col.diff.bellow : chart.col.diff.above);
        renderRectangleRough(svg, width, height, stroke, fill, chart, value);
        renderValue(svg, width, height, chart, value);

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
    let node= rc.rectangle(0, 0, width, height,
        {stroke: stroke, strokeWidth: chart.size.nr, roughness: chart.size.nr, fill: fill, fillWeight: chart.size.nr * factor, fillStyle: "hachure"});

    svg.selectAll("g")
        .data([1])
        .enter()
        .append("g")
        .append((d) => node);
}

function renderValue(svg, width, height, chart, value) {
    svg.append("text")
        .attr("y", 0 + (height/2 - chart.size.ySubtitleOffset/2))
        .attr("x",(width / 2))
        .attr("dy", "1em")
        .attr("class", "value " + chart.size.class)
        .style("text-anchor", "middle")
        .text(value);
}


// ====================================================================================================================
// The end.