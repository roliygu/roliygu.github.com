/**
 * Created by roliy on 15/9/21.
 */
define(['jquery',
        'underscore', 'backbone'],function($, _, backbone){
    var Model = backbone.Model.extend({
        init: function (opts) {
            this.opts = opts;
        },
        getGraphData:function(){

            var dtd = $.Deferred();

            $.ajax({
                url: "source/graph_edges_0.35_0.35",
                dataType: 'json',
                success: function(data){
                    debugger;
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
        }
    });
    return Model;
});