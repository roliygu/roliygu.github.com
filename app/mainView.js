define(['jquery',
        'underscore',
        'backbone',
        'require',
        'model',
        'jqueryFileStyle',
        'echarts',
        'bootstrap',
        'bootbox',
        'select2',
        'echarts/chart/scatter',],function ($, _, backbone, require, Model, jqueryFileStyle, echarts, bootstrap, bootbox, select2) {

    var tpls = {};

    var mainView = backbone.View.extend({

        events:{
            "change .file-input": "changeFile",
            "click .scatter-test-data": "downloadScatterTestData",
            "click .choose-which-dimension-btn": "setCurrentXY",
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

            this.loadAllCss();
            $(".jfilestyle:file").jfilestyle({
                buttonText: "上传数据文件"
            });
        },
        loadAllCss: function(){
            this.loadCss("../css/jquery-filestyle.css");
            this.loadCss("../css/bootstrap.css");
            this.loadCss('../css/select2.min.css');
            this.loadCss('../css/select2-bootstrap.min.css');
        },
        initScatterChart: function(){
            var _this = this;
            $(".echarts-view").width(1400);
            $(".echarts-view").height(600);
            _this.scatter = echarts.init($(_this.el).find(".echarts-view")[0]);
        },
        renderScatterChart: function(){
            var _this = this;

            if(!_this.scatter){
                _this.initScatterChart();
            }
            var option = _this.model.getScatterOption();
            _this.scatter.setOption(option);

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

                if(_this.model.ScatterData.dataWidth > 2){
                    _this.setCurrentXY();
                }

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
        },
        setCurrentXY: function(){
            var _this = this;

            if(!_this.model.ScatterData.allData){
                return;
            }

            // 导入模板,渲染两个下拉菜单
            if(!_this.chooseDimensionTpl){
                _this.chooseDimensionTpl = _this.getTpl(_this.tplUrl, "choose-which-dimension-tpl");
            }

            var _data = [];
            for(var i=0;i!=_this.model.ScatterData.dataWidth;i++){
                _data.push({
                    id: i,
                    text: '第i列'.replace(/i/, (i+1).toString())
                })
            }

            var dia = bootbox.dialog({
                title: "选择",
                message : _this.chooseDimensionTpl,
                buttons:{
                    'chosen':{
                        label:'确定',
                        className:'btn-primary',
                        callback:function(){
                            _this.model.ScatterData.current.x = $(".choose-x").val();
                            _this.model.ScatterData.current.y = $(".choose-y").val();
                            _this.renderScatterChart();
                        }
                    },
                    'success':{
                        label:'帮我降到2维',
                        className:'btn-success',
                        callback:function(){

                        }
                    }
                }
            });


            var html = "";
            $.each(_data,function(index,value){
                html += '<option value="' + _data[index].id+ '">'+_data[index].text+'</option>'
            });

            $(".choose-x").html(html);
            $(".choose-y").html(html);
        }


    });
    return mainView;
});
