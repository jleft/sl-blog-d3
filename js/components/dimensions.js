define ([
    'd3',
    'components/sl'
], function (d3, sl) {
    'use strict';

    sl.utility.dimensions = function () {

        // Default values
        var margin = {top: 20, right: 20, bottom: 20, left: 20},
            width = 960,
            height = 500;

        var defaultWidth = true,
            defaultHeight = true;

        var dimensions = function(selection) {
            // Potentially:
            // - Clear the selection's inner HTML

            selection.each( function() {
                var g = this;

                // Try to automatically size the chart to the selection
                if (defaultWidth === true) {
                    width = g.offsetWidth;
                    if (dimensions.innerWidth() < 1) {
                        width = 800 + margin.left + margin.right;
                    }
                }

                if (defaultHeight === true) {
                    height = g.offsetHeight;
                    if (dimensions.innerHeight() < 1) {
                        height = 300 + margin.top + margin.bottom;
                    }
                }

                // Create svg
                var svg = selection.append('svg')
                    .attr('width', width)
                    .attr('height', height);

                // Create group for the chart
                var chart =  svg.append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                // Clipping path
                chart.append('defs').append('clipPath')
                    .attr('id', 'plotAreaClip')
                    .append('rect')
                    .attr({ width: dimensions.innerWidth(), height: dimensions.innerHeight() });

                // Create plot area, using the clipping path
                chart.append('g')
                    .attr('clip-path', 'url(#plotAreaClip)')
                    .attr('class', 'plotArea');
            });
        };

        dimensions.marginTop = function (value) {
            if (!arguments.length) {
                return margin.top;
            }
            margin.top = value;
            return dimensions;
        };

        dimensions.marginRight = function (value) {
            if (!arguments.length) {
                return margin.right;
            }
            margin.right = value;
            return dimensions;
        };

        dimensions.marginBottom = function (value) {
            if (!arguments.length) {
                return margin.bottom;
            }
            margin.bottom = value;
            return dimensions;
        };

        dimensions.marginLeft = function (value) {
            if (!arguments.length) {
                return margin.left;
            }
            margin.left = value;
            return dimensions;
        };

        dimensions.width = function (value) {
            if (!arguments.length) {
                return width;
            }
            width = value;
            defaultWidth = false;
            return dimensions;
        };

        dimensions.height = function (value) {
            if (!arguments.length) {
                return height;
            }
            height = value;
            defaultHeight = false;
            return dimensions;
        };

        dimensions.innerWidth = function () {
            var innerWidth = width - margin.left - margin.right;
            return innerWidth;
        };

        dimensions.innerHeight = function () {
            var innerHeight = height - margin.top - margin.bottom;
            return innerHeight;
        };

        return dimensions;
    };
});