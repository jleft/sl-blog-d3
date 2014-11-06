define([
    'd3',
    'moment',
    'components/sl',
    'MockData',
    'jquery',
    'jquery.bootstrap',
    'jquery.bootstrap-slider',
    'GUI',
    'components/ohlcSeries',
    'components/dimensions'
], function (d3, moment, sl, MockData, $, GUI) {
    'use strict';

    var mockData = new MockData(0.1, 0.1, 100, 50, function (moment) {
        return !(moment.day() === 0 || moment.day() === 6);
    });

    var data = mockData.generateOHLC(new Date(2014, 6, 1), new Date(2014, 8, 1));

    var dimensions = sl.utilities.dimensions()
        .marginBottom(30)
        .marginLeft(50)
        .marginRight(50);

    function draw() {
        var xScale = d3.time.scale(),
            yScale = d3.scale.linear();

        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient('bottom')
            .ticks(5);

        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient('left');

        var yAxisRight = d3.svg.axis()
            .scale(yScale)
            .orient('right');

        var series = sl.series.ohlc()
            .xScale(xScale)
            .yScale(yScale);

        // Setup the chart
        var setupArea = d3.select('#chart')
            .call(dimensions);

        var svg = setupArea.select('svg'),
            chart = svg.select('g'),
            plotArea = chart.select('.plotArea');

        // Only used for contrast to aid understanding of how the dimensions are used
        plotArea.append('rect')
            .attr('fill', 'white')
            .attr('height', '100%')
            .attr('width', '100%');

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
        chart.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + dimensions.innerHeight() + ')')
            .call(xAxis);

        chart.append('g')
            .attr('class', 'y axis')
            .call(yAxis);

        chart.append('g')
            .attr('class', 'y axis right')
            .attr('transform', 'translate(' + dimensions.innerWidth() + ',0)')
            .call(yAxisRight);

        // Draw series.
        plotArea.append('g')
            .attr('class', 'series')
            .datum(data)
            .call(series);
    }

    // Setup sliders (not nice - only used for quick demo)
    $('#height').slider();
    $('#height').on('slide', function(e) {
        dimensions.height(e.value);
        $('#chart').empty();
        draw();
        $('#currentHeight').text(e.value);
        updateDimensionsDisplay();
    });

    $('#width').slider();
    $('#width').on('slide', function(e) {
        dimensions.width(e.value);
        $('#chart').empty();
        draw();
        updateDimensionsDisplay();
    });

    $('#marginTop').slider();
    $('#marginTop').on('slide', function(e) {
        dimensions.marginTop(e.value);
        $('#chart').empty();
        draw();
        updateDimensionsDisplay();
    });

    $('#marginRight').slider();
    $('#marginRight').on('slide', function(e) {
        dimensions.marginRight(e.value);
        $('#chart').empty();
        draw();
        updateDimensionsDisplay();
    });

    $('#marginBottom').slider();
    $('#marginBottom').on('slide', function(e) {
        dimensions.marginBottom(e.value);
        $('#chart').empty();
        draw();
        updateDimensionsDisplay();
    });

    $('#marginLeft').slider();
    $('#marginLeft').on('slide', function(e) {
        dimensions.marginLeft(e.value);
        $('#chart').empty();
        draw();
        updateDimensionsDisplay();
    });

    function updateDimensionsDisplay() {
        $('#currentWidth').text(dimensions.width());
        $('#currentHeight').text(dimensions.height());
        $('#innerWidth').text(dimensions.innerWidth());
        $('#innerHeight').text(dimensions.innerHeight());
        $('#currentMarginTop').text(dimensions.marginTop());
        $('#currentMarginRight').text(dimensions.marginRight());
        $('#currentMarginBottom').text(dimensions.marginBottom());
        $('#currentMarginLeft').text(dimensions.marginLeft());
    }

    updateDimensionsDisplay();
    draw();

});