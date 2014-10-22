define ([
    'd3',
    'components/sl'
], function (d3, sl) {
    'use strict';

    sl.utility.dimensions = function () {

        var margin = {top: 20, right: 20, bottom: 20, left: 20},
            width = 960,
            height = 500;

        var dimensions = { };

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
            return dimensions;
        };

        dimensions.height = function (value) {
            if (!arguments.length) {
                return height;
            }
            height = value;
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