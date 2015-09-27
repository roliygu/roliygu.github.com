/**
 * Created by roliy on 15/9/21.
 */
define(['jquery',
        'underscore',
        'backbone',
        'bootstrap',
        'bootbox'],function($, _, backbone, bootstrap, bootbox){
    var Model = backbone.Model.extend({

        inputFile:{

        },
        rowType:{
            dataRow:0,
            labelRow:1
        },
        path:{
            scatterTestDataUrl: '../static/ScatterTestData.txt'
        },
        initialize: function (opts) {
            var _this = this;
            this.opts = opts;
            this.on("change:inputFile", function(){
                _this.inputFile = event.target.result;
                _this.parseInputFile();
            });

        },
        getScatterOption: function(){
            var _this = this;

            if(!_this.inputData){
                return null;
            }

            var defaultOption = {
                title : {
                    text: '散点图'
                },
                tooltip : {
                    trigger: 'axis',
                    showDelay : 0,
                    formatter : function (params) {
                        return "("+params.data[0]+", "+params.data[1]+")";
                    },
                    axisPointer:{
                        show: true,
                        type : 'cross',
                        lineStyle: {
                            type : 'dashed',
                            width : 1
                        }
                    }
                },
                legend: {
                    data:[]
                },
                toolbox: {
                    show : true,
                    feature : {
                        mark : {show: true},
                        dataZoom : {show: true},
                        dataView : {show: true, readOnly: false},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                xAxis : [
                    {
                        type : 'value',
                        scale:true
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        scale:true
                    }
                ],
                series : [
                    {
                        // name:xxx,
                        type:'scatter',
                        //data:[[xxx],[xxx]],
                    }
                ]
            };

            if(_this.labels){
                // 有多组不同类的数据
                defaultOption.legend = {
                    data: _this.labels
                };

                for(var i=0;i!=_this.inputData.length;i++){
                    defaultOption.series[i] = {
                        type:'scatter',
                        name: _this.labels[i],
                        data: _this.inputData[i]
                    }
                }

            }else{
                defaultOption.legend = {
                    data: ['data']
                };

                defaultOption.series[0] = {
                    type:'scatter',
                    name: 'data',
                    data: _this.inputData
                }
            }


            return defaultOption;
        },
        parseInputFile: function(){
            var _this = this;
            if(!_this.inputFile){
                return;
            }

            if(!_this.inputData){
                _this.inputData = {};
            }

            var rows = _this.inputFile.split("\n");
            var result = _this.dataChecker(rows);

            if(result.status === -1){
                bootbox.alert(result.msg);
                return;
            }else{
                _this.inputData = result.resultData;
                _this.labels = result.labels;
                return;
            }
        },
        /**
         * 检查上传的数据是否符合规定.如果格式符合规定,则返回可供后续使用的数据格式
         * @param _data
         */
        dataChecker: function(_data){
            var _this = this;

            var labels = [];
            var resultData = [];

            // 如果首行为数据行,说明本数据文件没有分类
            if(_this.getRowType(_data[0])===_this.rowType.dataRow){
                labels = null;
                for(var i=0;i!==_data.length;i++){
                    if(_this.getRowType(_data[0])===_this.rowType.labelRow){
                        // 说明本应该是纯数据行的文件出现了标签行,此为错误情况
                        return {
                            status: -1,
                            msg: "不应该出现 label 行".replace(/label/, _data[i])
                        };
                    }
                    var thisRowList = [];
                    _.each(_data[i].split(','), function(item){
                        var tmp = parseFloat(item);
                        if(!tmp){
                            // 数据行出现了不能转换成数字的数据,此为错误情况
                            return {
                                status: -1,
                                msg: "第 i 行 item 不能转成数字".replace(/i/, i.toString()).replace(/item/, item)
                            }
                        }else{
                            thisRowList.push(parseFloat(item));
                        }
                    });
                    resultData.push(thisRowList);
                }
                return {
                    status: 1,
                    resultData: resultData
                }
            }

            // 第一行为标签行
            labels.push(_data[0]);
            var lastRowType = _this.rowType.labelRow;
            var lastLabel = _data[0];

            var labelInputData = [];
            for(var i=1;i!==_data.length;i++){
                var thisRowType = _this.getRowType(_data[i]);

                if(thisRowType===_this.rowType.labelRow){

                    if(lastRowType===_this.rowType.labelRow){
                        return {
                            status: -1,
                            msg: "数据格式不正确: label标签的数据为空".replace(/label/, lastLabel)
                        };
                    }else{

                        labels.push(_data[i]);
                        lastRowType = _this.rowType.labelRow;
                        lastLabel = _data[i];

                        resultData.push(labelInputData);
                        labelInputData = [];
                    }
                }else{
                    var thisRowList = [];
                    _.each(_data[i].split(','), function(item){
                        var tmp = parseFloat(item);
                        if(!tmp){
                            // 数据行出现了不能转换成数字的数据,此为错误情况
                            return {
                                status: -1,
                                msg: "第 i 行 item 不能转成数字".replace(/i/, i.toString()).replace(/item/, item)
                            }
                        }else{
                            thisRowList.push(parseFloat(item));
                        }
                    });

                    labelInputData.push(thisRowList);
                    lastRowType = _this.rowType.dataRow;
                }
            }

            resultData.push(labelInputData);

            return {
                status: 1,
                labels: labels,
                resultData: resultData
            }
        },
        /**
         * 通过检查该行是否包含逗号来决定该行是标签行还是数据行
         * @param _row
         * @returns {number}
         */
        getRowType:function(_row){
            var _this = this;

            var result = _row.indexOf(',');
            if(result === -1){
                return _this.rowType.labelRow;
            }else{
                return _this.rowType.dataRow;
            }
        },
        downloadScatterTestData: function(){
            this.download(this.path.scatterTestDataUrl);
        },
        getGraphData:function(){

            var dtd = $.Deferred();

            $.ajax({
                url: "source/graph_edges_0.35_0.35",
                dataType: 'json',
                success: function(data){
                    var node = new Array();
                    var edge = new Array();
                    for(var i in data){
                        var tmp = i.split('-');
                        var source = tmp[0];
                        var target = tmp[1];
                        node.push({category:0, name: source, value:10});
                        node.push({category:0, name: target, value:10});
                        edge.push({
                            source : source,
                            target : target,
                            weight : data[i]
                        });
                    }
                    node = _.unique(node, function(item){
                        return item.name;
                    });
                    edge = _.unique(edge, function(item){
                        return item.source + item.target;
                    });

                    dtd.resolve({node:node, edge:edge});
                }
            });

            return dtd.promise();
        },
        download: function(url) {

            var iframe = '<iframe id="my_iframe_xxxw" style="display:none;">';
            if ($('#my_iframe_xxxw').length == 0) {
                $('body').append(iframe);
            }

            document.getElementById('my_iframe_xxxw').src = url;
        },
    });
    return Model;
});
