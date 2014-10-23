/* jshint unused:false */
/* global require: true */
'use strict';
var require = {
    paths: {
        'd3': 'lib/d3',
        'jstat': 'lib/jstat',
        'moment': 'lib/moment',
        'moment-range': 'lib/moment-range',
        'modernizr': 'lib/modernizr',
        'jquery': 'lib/jquery',
        'jquery.bootstrap': 'lib/bootstrap',
        'jquery.bootstrap-slider': 'lib/bootstrap-slider',
        'GUI': 'lib/dat.gui'
    },
    shim: {
        'modernizr': {
            exports: 'Modernizr'
        },
        'jquery.bootstrap': {
            deps:['jquery']
        },
        'jquery.bootstrap-slider': {
            deps:['jquery', 'jquery.bootstrap']
        }
    },
    config: {
        moment: {
            noGlobal: true
        }
    }
};