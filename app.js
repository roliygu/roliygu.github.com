// For any third party dependencies, like jQuery, place them in the lib folder.

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.
requirejs.config({
    baseUrl: 'lib',
    paths: {
        app: '../app',
        jquery: '../lib/jquery',
        jqueryFileStyle: '../lib/jquery-filestyle',
        underscore: '../lib/underscore',
        backbone: '../lib/backbone',
        require: '../lib/require',
        echarts: '../lib/dist',
        bootbox: '../lib/bootbox.min',
        bootstrap: '../lib/bootstrap.min',
        view: '../app/mainView',
        model: '../app/mainModel'
    }
});

// Start loading the main app file. Put all of
// your application logic in there.
requirejs(['jquery','underscore','backbone', 'echarts', 'echarts/chart/force', 'view', 'echarts/chart/chord'],function($, _, backbone, ec, force, view){

    var view = new view({el: ".main-view"});
    view.init();
    view.render();

});
