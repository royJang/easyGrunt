$(function (){

    var currentReallyPath = $(".currentReallyPath");

    var drives = $(".drives");
    var filesLists = $(".filesLists");
    var filesListsTemplate = filesLists.text();

    var pathCtrl = $(".pathController"),
        back = pathCtrl.find(".back"),
        forward = pathCtrl.find(".forward");

    var anyFiles,
        drivesItem,
        reset;

    var log = [];

    var locked = true;

    var currentPaths = []; //当前路径

    _.templateSettings = {
        evaluate : /\{%([\s\S]+?)\%\}/g,
        interpolate : /\{%=([\s\S]+?)\%\}/g,
        escape : /\{%-([\s\S]+?)%\}/g
    };

    var log = {
        records : [],
        getLatestLog : function (){
            return this.records.slice(-2).slice(0,1);
        },
        addLog : function ( item ){
            this.getLatestLog() !== item && this.records.push( item );
        }
    };

    var util = {
        clearData : function (){
            currentPaths.length = 0;
            currentPaths = [];
            return true;
        },
        formatURL : function ( path ){
            if(path.indexOf(":") > -1){ //是一个盘符，回到初始位置,数组清空
                this.clearData() && currentPaths.push( path );
            }else{
                currentPaths.push( path );
            }
            var finallyPath = currentPaths.reduce(function ( pre, current, index, array ){
                //最后一位是/ 分隔符就不用加"/"
                var $join = pre.slice(-1) === "/" ? "" : "/";
                return pre + $join + current;
            });
            //最后一位是/ 分隔符就不用加"/",手动输入可能会后面带一个/
            if( finallyPath.slice(-1) !== "/" ) finallyPath += "/";
            currentReallyPath.val(finallyPath);
            return finallyPath;
        },
        //发送获取文件列表的请求
        getFileList : function ( path, options, callback ){
            if(!locked) return;
            locked = false;
            var defaultConfig = {
              format : true
            };
            var m =  _.extend( defaultConfig, options );
            var p = m.format == true ? this.formatURL( path ) : (Array.isArray(path) ? path[0] : path);
            var $j = $.post('/ls', { "paths" : p } , function ( data ){
                locked = true;
                data.length > 0 && log.addLog(p);
                return callback( null, data );
            }).error(function ( error ){
                locked = true;
                return callback( error.message );
            });
        },
        renderTemplate : function ( $data ){
            var render = _.template( filesListsTemplate );
            var _temp = render({ "files" : $data });
            return filesLists.html( _temp );
        }
    };

    var reInit = function (){
        drivesItem = drives.find(".drivesItem");
        anyFiles = filesLists.find("li");
        return true;
    };

    var reBind = function ( obj ){
        return obj.on("click", function (){
            var $dataPath = $(this).attr("data-path"); //优先使用传参来的路径
            if( !$dataPath ) return;
            var _data = $dataPath.indexOf("file!") > -1 ? $dataPath.replace("file!", "") : $dataPath;
            util.getFileList( _data,{},function ( err, data ){
                util.renderTemplate( data ) && reset();
            });
        });
    };

    var jump = function ( url ){
        currentReallyPath.val(url);
        util.getFileList( url, {
            format : false
        },function ( err, data ){
            util.renderTemplate( data ) && reset();
        });
    };

    //地址栏按回车
    $(document).on("keyup",function (e){
       if(e.which === 13){
          jump(currentReallyPath.val());
       }
    });

    //前进按钮


    //后退按钮
    back.on("click", function (){
        jump(log.getLatestLog());
    });

    reset = function (){
        reInit() && reBind(drivesItem) && reBind(anyFiles);
    };

    reset();
});