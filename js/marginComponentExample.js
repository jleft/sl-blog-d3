define([
    'd3',
    'moment',
    'components/sl',
    'MockData',
    'components/ohlcSeries',
    'components/dimensions'
], function (d3, moment, sl, MockData) {
    'use strict';

    var mockData = new MockData(0.1, 0.1, 100, 50, function (moment) {
        return !(moment.day() === 0 || moment.day() === 6);
    });

    var data = mockData.generateOHLC(new Date(2014, 6, 1), new Date(2014, 8, 1));

    var dimensions = sl.utility.dimensions()
        .marginBottom(20)
        .marginLeft(50)
        .width(720)
        .height(400);

    var xScale = d3.time.scale(),
        yScale = d3.scale.linear();

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        .ticks(5);

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left');

    var series = sl.series.ohlc()
        .xScale(xScale)
        .yScale(yScale);

    // Create svg element
    var svg = d3.select('#chart').classed('chart', true)
        .append('svg')
        .attr('width', dimensions.width())
        .attr('height', dimensions.height());

    // Ceate chart
    var g = svg.append('g')
        .attr('transform', 'translate(' + dimensions.marginLeft() + ',' + dimensions.marginTop() + ')');

    // Create plot area
    var plotArea = g.append('g');
    plotArea.append('clipPath')
        .attr('id', 'plotAreaClip')
        .append('rect')
        .attr({ width: dimensions.innerWidth(), height: dimensions.innerHeight() });
    plotArea.attr('clip-path', 'url(#plotAreaClip)');

    // Set scale domains
    var maxDate = d3.max(data, function (d) {
        return d.date;
    });

    xScale.domain([
        new Date(maxDate.getTime() - (8.64e7 * 31.5)),
        new Date(maxDate.getTime() + 8.64e7)
    ]);

    var xDomain = xScale.domain();
    var range = moment().range(xDomain[0], xDomain[1]);
    var displayedData = [];
    for (var i = 0; i < data.length; i += 1) {
        if (range.contains(data[i].date)) {
            displayedData.push(data[i]);
        }
    }

    yScale.domain(
        [
            d3.min(displayedData, function (d) {
                return d.low;
            }),
            d3.max(displayedData, function (d) {
                return d.high;
            })
        ]
    ).nice();

    // Set scale ranges
    xScale.range([0, dimensions.innerWidth()]);
    yScale.range([dimensions.innerHeight(), 0]);

    // Draw axes
    g.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + dimensions.innerHeight() + ')')
        .call(xAxis);

    g.append('g')
        .attr('class', 'y axis')
        .call(yAxis);

    // Draw series.
    plotArea.append('g')
        .attr('class', 'series')
        .datum(data)
        .call(series);
});