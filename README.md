Dimensions
==========

Based on the [Margin Convention](http://bl.ocks.org/mbostock/3019563), the Dimensions component is responsible for defining the chart area.

It attempts to simplify the process of constructing the chart area:

+ Define the margins, height and width
+ Calculate the inner height and inner width
+ Create an SVG
+ Create a group for all chart elements; translate it based on the margins
+ Create a clipping path for the plot area; add it to the group

## API Reference

#### sl.utilities.dimensions()

Constructs the dimensions component, with default values.

#### dimensions(selection)

Apply the dimensions to a [selection](https://github.com/mbostock/d3/wiki/Selections). (Commonly  a `div`.) The dimensions component can be applied to one or more elements.

If the width or height have not been set, for example:

```javascript
// Create the dimensions (width and height not set)
var dimensions = sl.utility.dimensions();

// Setup the chart
// Height and width automatically calculated from dimensions of #chart 
var setupArea = d3.select('#chart')
    .call(dimensions);
```

Then the width and height of the dimensions will attempt to automatically size to the dimensions of the selected element, respectively. If this results in an invalid value, i.e. less than 0, a default value will be used.

#### dimensions.**marginTop**(value)

If _value_ is specified, sets the top margin and returns the dimensions; if _value_ is not specified, returns the top margin.

#### dimensions.marginRight(value)

If _value_ is specified, sets the right margin and returns the dimensions; if _value_ is not specified, returns the right margin.

#### dimensions.marginBottom(value)

If _value_ is specified, sets the bottom margin and returns the dimensions; if _value_ is not specified, returns the bottom margin.

#### dimensions.marginLeft(value)

If _value_ is specified, sets the left margin and returns the dimensions; if _value_ is not specified, returns the left margin.

#### dimensions.width(value)

If _value_ is specified, sets the width and returns the dimensions; if _value_ is not specified, returns the width.

#### dimensions.height(value)

If _value_ is specified, sets the height and returns the dimensions; if _value_ is not specified, returns the height.

#### dimensions.innerWidth()

Returns the width of the chart minus the horizontal margins.

#### dimensions.innerHeight()

Returns the height of the chart minus the vertical margins.

## Example Usage

Explicitly define the height, width, bottom margin and left margin; use default top and right margins:

```javascript
// Setup the dimensions
var dimensions = sl.utilities.dimensions()
    .marginBottom(30)
    .marginLeft(50)
    .width(660)
    .height(400);

// Setup the chart
var setupArea = d3.select('#chart')
    .call(dimensions);

// Select the elements which we may want to use
// Typically axes will be added to the 'chart' and series to the 'plotArea'
var svg = setupArea.select('svg'),
    chart = svg.select('g'),
    plotArea = chart.select('.plotArea');
```

Attempt to automatically size the chart to the selected element, by not specifying the width or height; use default margins:

```javascript
// Setup the dimensions
var dimensions = sl.utilities.dimensions();

// Setup the chart
var setupArea = d3.select('#chart')
    .call(dimensions);

// Select the elements which we may want to use
// Typically axes will be added to the 'chart' and series to the 'plotArea'
var svg = setupArea.select('svg'),
    chart = svg.select('g'),
    plotArea = chart.select('.plotArea');
```

Attempt to automatically size the chart to the width of the selected element; use specified height and margins:

```javascript
// Setup the dimensions
var dimensions = sl.utilities.dimensions()
  .height(380)
  .marginTop(25)
  .marginRight(40)
  .marginBottom(30)
  .marginLeft(40);

// Setup the chart
var setupArea = d3.select('#chart')
    .call(dimensions);

// Select the elements which we may want to use
// Typically axes will be added to the 'chart' and series to the 'plotArea'
var svg = setupArea.select('svg'),
    chart = svg.select('g'),
    plotArea = chart.select('.plotArea');
```