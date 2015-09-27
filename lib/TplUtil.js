/**
 * Created by liunickluck on 15/2/25.
 */
define(['underscore', 'jquery', 'require'],function(_, jQuery, require){
    (function($,context){
        var tpls = {};
        function getTpl(url,id){


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
    })(jQuery,window);
    return window.TplUtil;
});

