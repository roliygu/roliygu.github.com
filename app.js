// For any third party dependencies, like jQuery, place them in the lib folder.

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.
requirejs.config({
    baseUrl: 'lib',
    paths: {
        app: '../app',
        jquery: '../lib/jquery',
        underscore: '../lib/underscore',
        backbone: '../lib/backbone',
        echarts: '../lib/dist',
        view: '../app/view',
        model: '../app/model'
    }
});

// Start loading the main app file. Put all of
// your application logic in there.
requirejs(['jquery','underscore','backbone', 'echarts', 'echarts/chart/force', 'model', 'echarts/chart/chord'],function($, _, backbone, ec, force, model){

    mo = new model();
    debugger;
    mo.getGraphData().done(function(res){

        debugger;
        var myChart = ec.init(document.getElementById('main'));

        var option = {
            title : {
                text: '试题关系',
                subtext: '数据来自云校',
                x:'right',
                y:'bottom'
            },
            tooltip : {
                trigger: 'item',
                formatter: '{a} : {b}'
            },
            toolbox: {
                show : true,
                feature : {
                    restore : {show: true},
                    magicType: {show: true, type: ['force', 'chord']},
                    saveAsImage : {show: true}
                }
            },
            legend: {
                x: 'left',
                data:['题目']
            },
            size:'500%',
            series : [
                {
                    type:'force',
                    name : "试题关系",
                    ribbonType: true,
                    categories : [
                        {
                            name: '题目'
                        }
                    ],
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                textStyle: {
                                    color: '#333'
                                }
                            },
                            nodeStyle : {
                                brushType : 'both',
                                borderColor : 'rgba(255,215,0,0.4)',
                                borderWidth : 1
                            },
                            linkStyle: {
                                type: 'line'
                            }
                        },
                        emphasis: {
                            label: {
                                show: false
                                // textStyle: null      // 默认使用全局文本样式，详见TEXTSTYLE
                            },
                            nodeStyle : {
                                //r: 30
                            },
                            linkStyle : {}
                        }
                    },
                    useWorker: false,
                    minRadius : 50,
                    maxRadius : 75,
                    gravity: 0.5,
                    large: false,
                    scaling: 1.5,
                    roam: 'move',
                    nodes:res.node,
                    links : res.edge
                }
            ]
        };
        var ecConfig = require('echarts/config');
        function focus(param) {
            var data = param.data;
            var links = option.series[0].links;
            var nodes = option.series[0].nodes;
            if (
                data.source !== undefined
                && data.target !== undefined
            ) { //点击的是边
                var sourceNode = nodes.filter(function (n) {return n.name == data.source})[0];
                var targetNode = nodes.filter(function (n) {return n.name == data.target})[0];
                console.log("选中了边 " + sourceNode.name + ' -> ' + targetNode.name + ' (' + data.weight + ')');
            } else { // 点击的是点
                console.log("选中了" + data.name + '(' + data.value + ')');
            }
        }
        myChart.on(ecConfig.EVENT.CLICK, focus)

        myChart.on(ecConfig.EVENT.FORCE_LAYOUT_END, function () {
            console.log(myChart.chart.force.getPosition());
        });

        // 为echarts对象加载数据
        myChart.setOption(option);
    });

    //setTimeout(function(){
    //    debugger;
    //    var myChart = ec.init(document.getElementById('main'));
    //    var data = mo.getGraphData();
    //    option = {
    //        title : {
    //            text: '试题关系',
    //            subtext: '数据来自云校',
    //            x:'right',
    //            y:'bottom'
    //        },
    //        tooltip : {
    //            trigger: 'item',
    //            formatter: '{a} : {b}'
    //        },
    //        toolbox: {
    //            show : true,
    //            feature : {
    //                restore : {show: true},
    //                magicType: {show: true, type: ['force', 'chord']},
    //                saveAsImage : {show: true}
    //            }
    //        },
    //        legend: {
    //            x: 'left',
    //            data:['题目']
    //        },
    //        series : [
    //            {
    //                type:'force',
    //                name : "试题关系",
    //                ribbonType: false,
    //                categories : [
    //                    {
    //                        name: '题目'
    //                    }
    //                ],
    //                itemStyle: {
    //                    normal: {
    //                        label: {
    //                            show: true,
    //                            textStyle: {
    //                                color: '#333'
    //                            }
    //                        },
    //                        nodeStyle : {
    //                            brushType : 'both',
    //                            borderColor : 'rgba(255,215,0,0.4)',
    //                            borderWidth : 1
    //                        },
    //                        linkStyle: {
    //                            type: 'curve'
    //                        }
    //                    },
    //                    emphasis: {
    //                        label: {
    //                            show: false
    //                            // textStyle: null      // 默认使用全局文本样式，详见TEXTSTYLE
    //                        },
    //                        nodeStyle : {
    //                            //r: 30
    //                        },
    //                        linkStyle : {}
    //                    }
    //                },
    //                useWorker: false,
    //                minRadius : 15,
    //                maxRadius : 25,
    //                gravity: 1.1,
    //                scaling: 1.1,
    //                roam: 'move',
    //                nodes:[
    //                    //{category:0, name: '乔布斯', value : 10, label: '乔布斯\n（主要）'},
    //                    //{category:2, name: '丽萨-乔布斯',value : 2},
    //                    //{category:1, name: '保罗-乔布斯',value : 3},
    //                    //{category:1, name: '克拉拉-乔布斯',value : 3},
    //                    //{category:1, name: '劳伦-鲍威尔',value : 7},
    //                    //{category:2, name: '史蒂夫-沃兹尼艾克',value : 5},
    //                    //{category:2, name: '奥巴马',value : 8},
    //                    //{category:2, name: '比尔-盖茨',value : 9},
    //                    //{category:2, name: '乔纳森-艾夫',value : 4},
    //                    //{category:2, name: '蒂姆-库克',value : 4},
    //                    //{category:2, name: '龙-韦恩',value : 1},
    //                ],
    //                links : [
    //                    //{source : '丽萨-乔布斯', target : '乔布斯', weight : 1},
    //                    //{source : '保罗-乔布斯', target : '乔布斯', weight : 2},
    //                    //{source : '克拉拉-乔布斯', target : '乔布斯', weight : 1},
    //                    //{source : '劳伦-鲍威尔', target : '乔布斯', weight : 2},
    //                    //{source : '史蒂夫-沃兹尼艾克', target : '乔布斯', weight : 3},
    //                    //{source : '奥巴马', target : '乔布斯', weight : 1},
    //                    //{source : '比尔-盖茨', target : '乔布斯', weight : 6},
    //                    //{source : '乔纳森-艾夫', target : '乔布斯', weight : 1},
    //                    //{source : '蒂姆-库克', target : '乔布斯', weight : 1},
    //                    //{source : '龙-韦恩', target : '乔布斯', weight : 1},
    //                    //{source : '克拉拉-乔布斯', target : '保罗-乔布斯', weight : 1},
    //                    //{source : '奥巴马', target : '保罗-乔布斯', weight : 1},
    //                    //{source : '奥巴马', target : '克拉拉-乔布斯', weight : 1},
    //                    //{source : '奥巴马', target : '劳伦-鲍威尔', weight : 1},
    //                    //{source : '奥巴马', target : '史蒂夫-沃兹尼艾克', weight : 1},
    //                    //{source : '比尔-盖茨', target : '奥巴马', weight : 6},
    //                    //{source : '比尔-盖茨', target : '克拉拉-乔布斯', weight : 1},
    //                    //{source : '蒂姆-库克', target : '奥巴马', weight : 1}
    //                ]
    //            }
    //        ]
    //    };
    //    var ecConfig = require('echarts/config');
    //    function focus(param) {
    //        var data = param.data;
    //        var links = option.series[0].links;
    //        var nodes = option.series[0].nodes;
    //        if (
    //            data.source !== undefined
    //            && data.target !== undefined
    //        ) { //点击的是边
    //            var sourceNode = nodes.filter(function (n) {return n.name == data.source})[0];
    //            var targetNode = nodes.filter(function (n) {return n.name == data.target})[0];
    //            console.log("选中了边 " + sourceNode.name + ' -> ' + targetNode.name + ' (' + data.weight + ')');
    //        } else { // 点击的是点
    //            console.log("选中了" + data.name + '(' + data.value + ')');
    //        }
    //    }
    //    myChart.on(ecConfig.EVENT.CLICK, focus)
    //
    //    myChart.on(ecConfig.EVENT.FORCE_LAYOUT_END, function () {
    //        console.log(myChart.chart.force.getPosition());
    //    });
    //
    //    // 为echarts对象加载数据
    //    myChart.setOption(option);
    //}, 100);
});
