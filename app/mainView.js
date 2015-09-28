define(['jquery',
        'underscore',
        'backbone',
        'require',
        'model',
        'jqueryFileStyle',
        'echarts',
        'echarts/chart/scatter'],function ($, _, backbone, require, Model, jqueryFileStyle, echarts) {

    var tpls = {};

    var mainView = backbone.View.extend({

        events:{
            "change .file-input": "changeFile",
            "click .scatter-test-data": "downloadScatterTestData",
        },
        initialize: function(opts){

            this.model = new Model();
            this.tplUrl = '../app/main.tpl';

            if(!this.mainTpl){
                this.mainTpl = this.getTpl(this.tplUrl, "main-view-tpl");
            }
        },
        render: function(){
            this.$el.html(this.mainTpl);
            this.loadCss("../css/jquery-filestyle.css");
            this.loadCss("../css/bootstrap.css");
            $(".jfilestyle:file").jfilestyle({
                buttonText: "上传数据文件"
            });
        },
        renderScatterChart: function(){
            var _this = this;

            var option = _this.model.getScatterOption();

            $(".echarts-view").width(1400);
            $(".echarts-view").height(600);
            var scatter = echarts.init($(_this.el).find(".echarts-view")[0]);
            scatter.setOption(option);

            return;

        },
        downloadScatterTestData: function(){
            this.model.downloadScatterTestData();
        },
        changeFile:function(event){
            var _this = this;
            var file = event.target.files[0];
            var reader = new FileReader();
            reader.onload = function(event){
                // event.target.result 就是文件的内容
                _this.model.set("inputFile", event.target.result);
                _this.renderScatterChart();
            };
            reader.readAsText(file);
        },
        loadCss:function(cssPath){

            cssPath = require.toUrl(cssPath);
            if($('head').find("link[href='"+cssPath+"']").length>0){
                return;
            }
            var css=$("<link rel='stylesheet' type='text/css'>");
            css.attr("href",cssPath);
            $("head").append(css);
        },
        getTpl: function(url,id){
            if(tpls[id]){
                return tpls[id];
            }else{
                url = require.toUrl(url);
                $.ajax({
                    url:url,
                    type:'get',
                    dataType:"text",
                    async:false
                }).done(function(text){
                    if(!text)return;
                    var $module = $('<div/>');
                    $module.html(text);
                    var $tmp = $module.find('script');
                    for(var i=0;i<$tmp.length;i++){
                        tpls[$tmp[i].id] = $tmp[i].innerHTML;
                    }
                    $module.remove();
                });

                return tpls[id];
            }
        }


    });
    return mainView;
});
