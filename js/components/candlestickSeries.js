define ([
    'd3',
    'components/sl'
], function (d3, sl) {
    'use strict';

    sl.series.candlestick = function () {

        var xScale = d3.time.scale(),
            yScale = d3.scale.linear();

        var isUpDay = function(d) {
            return d.close > d.open;
        };
        var isDownDay = function (d) {
            return d.close < d.open;
        };

        var line = d3.svg.line()
            .x(function (d) {
                return d.x;
            })
            .y(function (d) {
                return d.y;
            });

        var highLowLines = function (bars) {
            var paths = bars.selectAll('.high-low-line');

            paths = paths.data(function (d) {
                return [d];
            });

            paths.enter().append('path')
                .classed('high-low-line', true);

            paths.attr('d', function (d) {
                    return line([
                        { x: xScale(d.date), y: yScale(d.high) },
                        { x: xScale(d.date), y: yScale(d.low) }
                    ]);
                });
        };

        var body = function(d) {
            var rectangleWidth = 10;
            // BODY
            // Move to the opening price
            var bodyPath = 'M' + (xScale(d.date) - rectangleWidth/2) + ',' + yScale(d.open) +
            // Draw the width
            'h' + rectangleWidth +
            // Draw to the closing price (vertically)
            'V' + yScale(d.close) +
            // Draw the width
            'h' + -rectangleWidth +
            // Move back to the opening price and enclose the price
            'V' + yScale(d.open) +
            'z';
            // SHADOWS / WICKS
            // Move to the highest of either close or open and draw the high wick
            var highWick = 'M' + (xScale(d.date)) + ',' + Math.max(yScale(d.close), yScale(d.open)) + 
            'V' + yScale(d.high);
            // Move 
            var lowWick = 'M' + (xScale(d.date)) + ',' + Math.min(yScale(d.close), yScale(d.open)) + 
            'V' + yScale(d.low);

            return bodyPath /*+ highWick + lowWick*/;
        };

        var rectangles = function (bars) {
            var rect = bars.selectAll('.rect-path').data(function (d) {
                return [d];
            });

            rect.enter().append('path')
                .classed('rect-path', true);

            // rect.attr('d', function(d) {
            //        return body(d);
            //     })
            //     .attr('transform', null)
            //     .transition()
            //     .ease('linear')
            //     .attr('transform', 'translate(' + -1 + ')');

            // rect.attr('d', function(d) {
            //        return body(d);
            //     }).attr('stroke-dashoffset', 10)
            //     .transition()
            //     .ease('linear')
            //     .duration(500)
            //     .attr('stroke-dashoffset', 0);

            function logThis() {
                var paths = bars.selectAll('.high-low-line');

            paths = paths.data(function (d) {
                return [d];
            });

            paths.enter().append('path')
                .classed('high-low-line', true);

            paths.attr('d', function (d) {
                    return line([
                        { x: xScale(d.date), y: yScale(d.high) },
                        { x: xScale(d.date), y: yScale(d.low) }
                    ]);
                });
            }

            d3.transition(rect).attr('d', function(d) {
                   return body(d);
                }).each('end', null);
        };

        var candlestick = function (selection) {
            var series, bars;

            selection.each(function (data) {
                series = d3.select(this);

                bars = series.selectAll('.bar')
                    .data(data, function (d) {
                        return d.date;
                    });

                bars.enter()
                    .append('g')
                    .classed('bar', true);
                    // .style('opacity', 1e-6);

                bars.classed({
                    'up-day': isUpDay,
                    'down-day': isDownDay
                });

                var paths = bars.selectAll('.high-low-line').remove();

                // highLowLines(bars);
                rectangles(bars);

                // d3.transition(bars).style('opacity', 1);

                // d3.transition(bars.exit()).style('opacity', 1e-6).remove();

                bars.exit().remove();
            });
        };

        candlestick.xScale = function (value) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = value;
            return candlestick;
        };

        candlestick.yScale = function (value) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = value;
            return candlestick;
        };

        return candlestick;
    };
});