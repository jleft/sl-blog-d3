define([
    'd3',
    'moment',
    'components/sl',
    'components/ohlcSeries',
    'moment-range'
], function (d3, moment, sl) {
    'use strict';

    var dataset;
    var datasetIndex = 20;

    d3.csv('../data/TestStreamingData.csv', function(d) {
        return {
            date: new Date(d.date),
            open: +d.open,
            high: +d.high,
            low: +d.low,
            close: +d.close 
        };
    }, function(error, rows) {
        // Get all of the entries from the file
        dataset = rows;

        var data = processDatasetForChart(dataset);
        drawAxesAndSeries(data);
    });

    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 660 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    var xScale = d3.time.scale(),
        yScale = d3.scale.linear();

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        .ticks(d3.time.minutes, 1);

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left');

    var series = sl.series.ohlc()
        .xScale(xScale)
        .yScale(yScale);

    // Create svg element
    var svg = d3.select('#chart').classed('chart', true).append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

    // Create chart
    var g = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // Create plot area
    var plotArea = g.append('g');
    plotArea.append('clipPath')
        .attr('id', 'plotAreaClip')
        .append('rect')
        .attr({ width: width, height: height });
    plotArea.attr('clip-path', 'url(#plotAreaClip)');

    function _updateScales(data) {
        // Set scale domains
        var maxDate = d3.max(data, function (d) {
            return d.date;
        });

        var minute = 6e4; // in milliseconds
        xScale.domain([
            new Date(maxDate.getTime() - minute * 15),
            new Date(maxDate.getTime() + minute / 2)
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
                    return d.low - 0.2;
                }),
                d3.max(displayedData, function (d) {
                    return d.high + 0.2;
                })
            ]
        ).nice();

        // Set scale ranges
        xScale.range([0, width]);
        yScale.range([height, 0]);
    }

    function drawAxesAndSeries(data) {
        _updateScales(data);

        // Draw axes
        g.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis);

        g.append('g')
            .attr('class', 'y axis')
            .call(yAxis);

        // Draw series.
        plotArea.append('g')
            .attr('class', 'series')
            .datum(data)
            .call(series);
    }

    function updateAxesAndSeries(data) {
        _updateScales(data);

        // Update axes
        g.select('.x.axis')
            .call(xAxis);

        g.select('.y.axis')
            .call(yAxis);

        // Update series
        plotArea.select('.series')
            .datum(data)
            .call(series);
    }

    function processDatasetForChart() {
        // If we've reached the length of the dataset, then reset the index
        if (datasetIndex === dataset.length + 1) {
            datasetIndex = 20;
        }

        // Get the first <datasetIndex> entries from the array
        var data = [];
        data = dataset.slice(0, datasetIndex += 1);

        // Nest entries using their date as the key
        data = d3.nest()
            .key(function(d) {
                return d.date;
            })
            .entries(data);

        // If there are any duplicates, use the latest in the array
        var dataWithEarliestDuplicatesRemoved = [];
        data.forEach(function(entry) {
            dataWithEarliestDuplicatesRemoved.push(entry.values[entry.values.length - 1]);        
        });

        return dataWithEarliestDuplicatesRemoved;
    }

    // Update the data for the chart at a set time interval
    setInterval(function() {
        var data = processDatasetForChart();
        updateAxesAndSeries(data);
    }, 1000);
});