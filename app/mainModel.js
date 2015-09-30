/**
 * Created by roliy on 15/9/21.
 */
define(['jquery',
        'underscore',
        'backbone',
        'bootstrap',
        'bootbox',
        'require'],function($, _, backbone, bootstrap, bootbox, require){


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
        ScatterData: {
            // labels:[]
            // allData: []
            current:{
                x: 0,
                y: 1
            },
            dataWidth:-1
        },
        initialize: function (opts) {
            var _this = this;
            this.opts = opts;
            this.on("change:inputFile", function(){
                _this.initScatterData();
                _this.inputFile = event.target.result;
                _this.parseInputFile();
            });
        },
        initScatterData: function(){
            this.ScatterData = {
                current:{
                    x: 0,
                    y: 1
                },
                dataWidth:-1
            }
        },
        getScatterOption: function(){
            debugger;
            var _this = this;

            if(!_this.ScatterData.allData){
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
                        type:'scatter'
                        //data:[[xxx],[xxx]],
                    }
                ]
            };

            if(_this.ScatterData.labels){
                defaultOption.legend = {
                    data: _this.ScatterData.labels
                };

                debugger;
                for(var i=0;i!=_this.ScatterData.allData.length;i++){
                    defaultOption.series[i] = {
                        type:'scatter',
                        name: _this.ScatterData.labels[i],
                        data: _this.ScatterData.allData[i]
                    }
                }
            }

            debugger;
            return defaultOption;
        },
        parseInputFile: function(){
            var _this = this;
            if(!_this.inputFile){
                return;
            }

            var rows = _this.inputFile.split("\n");
            var result = _this.dataChecker(rows);
            if(result.status === -1){
                bootbox.alert(result.msg);
                return;
            }else{
                _this.ScatterData.allData = result.resultData;
                _this.ScatterData.labels = result.labels;
                _this.ScatterData.dataWidth  = result.dataWidth
                return;
            }
        },



        /**
         * 检查上传的数据是否符合规定.如果格式符合规定,则返回可供后续使用的数据格式
         * @param _data
         * 返回的对象如果status=-1,表示数据有误,如果返回status=1,表示数据正常
         * status=-1时,msg字段有效,表示错误信息
         * status=1时,labels为空表示数据没有分类,如果不为空则labels为分类标签的数组
         * status=1时,resultData为转成number的数据,resultData是一个三维列表,
         *         第一维的index表示该数据的类别,如果数据无分类,则第一维长度为1;
         *         第二维的index表示是该类数据中的第几个数据
         *         第三维是这个数据
         */
        dataChecker: function(_data){
            var _this = this;

            var labels = [];
            var resultData = [];

            var result = {
                resultData: [],
                labels: [],
                status: -1
            };

            // 如果首行为数据行,说明本数据文件没有分类
            if(_this.isDataRow(_data[0])){

                result.labels = ['data'];

                for(var i=0;i!==_data.length;i++){
                    if(_this.isLabelRow(_data[i])){
                        result.msg = "不应该出现 label 行".replace(/label/, _data[i]);
                        return result;
                    }

                    var thisRowList = [];
                    _.each(_data[i].split(','), function(item){
                        var tmp = parseFloat(item);
                        if(!tmp){
                            result.msg = "第 i 行 item 不能转成数字".replace(/i/, i.toString()).replace(/item/, item);
                            return result;
                        }else{
                            thisRowList.push(tmp);
                        }
                    });

                    if(!result.dataWidth){
                        result.dataWidth = thisRowList.length;
                    }else{
                        if(result.dataWidth !== thisRowList.length){
                            result.msg = "第 i 行数据缺失".replace(/i/, i.toString());
                            return result;
                        }
                    }

                    resultData.push(thisRowList);
                }

                result.resultData.push(resultData);
                result.status=1;
                return result;
            }

            // 第一行为标签行,表示是有分类的数据
            result.labels.push(_data[0]);
            var lastRowType = _this.rowType.labelRow;
            var lastLabel = _data[0];

            var labelInputData = [];
            for(var i=1;i!==_data.length;i++){

                if(_this.isLabelRow(_data[i])){

                    if(lastRowType===_this.rowType.labelRow){
                        result.msg = "数据格式不正确: label标签的数据为空".replace(/label/, lastLabel);
                        return result;
                    }else{
                        result.labels.push(_data[i]);
                        lastRowType = _this.rowType.labelRow;
                        lastLabel = _data[i];

                        result.resultData.push(labelInputData);
                        labelInputData = [];
                    }
                }else{
                    var thisRowList = [];
                    _.each(_data[i].split(','), function(item){
                        var tmp = parseFloat(item);
                        if(!tmp){
                            result.msg = "第 i 行 item 不能转成数字".replace(/i/, i.toString()).replace(/item/, item);
                            return result;
                        }else{
                            thisRowList.push(tmp);
                        }
                    });

                    if(!result.dataWidth){
                        result.dataWidth = thisRowList.length;
                    }else{
                        if(result.dataWidth !== thisRowList.length){
                            result.msg = "第 i 行数据缺失".replace(/i/, i.toString());
                            return result;
                        }
                    }

                    labelInputData.push(thisRowList);
                    lastRowType = _this.rowType.dataRow;
                }
            }

            result.resultData.push(labelInputData);
            result.status = 1;
            return result;
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
            var _this = this;
            _this.getAjaxData(_this.path.scatterTestDataUrl, "text").done(function(res){
                _this.downloadFile("ScatterTestData.txt", res);
            });
        },
        getAjaxData: function(_url, _dataType){
            var _this = this;
            var dtd = $.Deferred();

            $.ajax({
                url: _url,
                dataType: _dataType,
                success: function(res){
                    dtd.resolve(res);
                }
            });

            return dtd.promise();
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
        /**
         *
         * @param fileName
         * @param content
         * 从前端下载文件
         */
        downloadFile: function (fileName, content){
            var aLink = document.createElement('a');
            var blob = new Blob([content]);
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent("click", false, false);
            aLink.download = fileName;
            aLink.href = URL.createObjectURL(blob);
            aLink.dispatchEvent(evt);
        },
        isDataRow: function(row){
            var _this = this;
            return _this.getRowType(row) === _this.rowType.dataRow;
        },
        isLabelRow: function(row){
            var _this = this;
            return _this.getRowType(row) === _this.rowType.labelRow;
        }
    });
    return Model;
});
