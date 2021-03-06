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
            var paths = bars.selectAll('.high-low-line').data(function (d) {
                return [d];
            });

            paths.enter().append('path');

            d3.transition(paths.classed('high-low-line', true))
                .attr('d', function (d) {
                    return line([
                        { x: xScale(d.date), y: yScale(d.high) },
                        { x: xScale(d.date), y: yScale(d.low) }
                    ]);
                });
        };

        var rectangles = function (bars) {
            var rectangleWidth = 5;

            var rect = bars.selectAll('rect').data(function (d) {
                return [d];
            });

            rect.enter().append('rect');

            d3.transition(rect).attr('x', function (d) {
                    return xScale(d.date) - rectangleWidth;
                })
                .attr('y', function (d) {
                    return isUpDay(d) ? yScale(d.close) : yScale(d.open);
                })
                .attr('width', rectangleWidth * 2)
                .attr('height', function (d) {
                    var body = Math.abs(yScale(d.open) - yScale(d.close));
                    // If we have a netural entry, set its height to 1
                    return body === 0 ? 1 : body;
                });
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
                    .classed('bar', true)
                    .style('opacity', 1e-6);

                bars.classed({
                    'up-day': isUpDay,
                    'down-day': isDownDay
                });

                highLowLines(bars);
                rectangles(bars);

                d3.transition(bars).style('opacity', 1);

                d3.transition(bars.exit()).style('opacity', 1e-6).remove();
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