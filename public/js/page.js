$(function (){

    var filesLists = $(".filesLists");
    var filesListsTemplate = filesLists.text();

    _.templateSettings = {
        evaluate : /\{%([\s\S]+?)\%\}/g,
        interpolate : /\{%=([\s\S]+?)\%\}/g,
        escape : /\{%-([\s\S]+?)%\}/g
    };

    var getFilesList = function ( path, callback ){
        path = path + "/";
        $.post('/ls', { "paths" : path, "timestamp" : +new Date } , function ( data ){
            return callback( null, data );
        }).error(function ( error ){
            return callback( error.message );
        })
    };

    var renderTemplate = function ( $data ){
        var render = _.template( filesListsTemplate );
        var _temp = render({ "files" : $data });
        filesLists.html( _temp );
    };

    var filesChoose = function ( path ){
        filesLists.find("li").on("click", function (){
            var el = $(this).attr("data-path");
            el = el.indexOf("file!") > -1 && el.replace("file!", "");
            getFilesList(path + "/" + el,function ( err, data ){
                renderTemplate( data );
                filesChoose(path + "/" + el);
            });
        });
    };

    var driverChoose = function (){
        var dirvesItem = $(".dirvesItem");
        dirvesItem.on("click", function (){
            var driver = $(this).attr("data-path");
            getFilesList( driver, function (err, data){
                renderTemplate( data );
                filesChoose( driver );
            });
        });
    };

    driverChoose();

});