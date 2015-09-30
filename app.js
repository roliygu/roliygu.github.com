// For any third party dependencies, like jQuery, place them in the lib folder.

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.
requirejs.config({
    baseUrl: 'lib',
    paths: {
        app: '../app',
        jquery: './jquery.min',
        jqueryFileStyle: './jquery-filestyle',
        underscore: './underscore',
        backbone: './backbone.min',
        require: './require',
        echarts: './dist',
        bootbox: './bootbox.min',
        bootstrap: './bootstrap.min',
        select2: './select2',
        view: '../app/mainView',
        model: '../app/mainModel',
    },
    shim:{
        'backbone':{
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'underscore':{
            export: '_'
        },
        'jqueryFileStyle':['jquery'],
        'bootstrap': ['jquery'],
        'bootbox':['bootstrap']
    }
});

// Start loading the main app file. Put all of
// your application logic in there.
requirejs(['jquery','view'],function($, view){

    var view = new view({el: ".main-view"});
    view.render();

});
