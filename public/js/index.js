define("index", ['jQuery', 'underscore', 'util', 'variable'], function ( jquery, _, Util, v ){

    var util = new Util();

    var jump = function ( url ){
        v.currentReallyPath.val( url );
        util.getFileList( url );
    };

    //地址栏按回车
    $(document).on("keyup",function (e){
        if(e.which === 13){
            jump(v.currentReallyPath.val());
        }
    });

    //上一级
    v.filePre.on("click",function (){
       jump($(this).attr("data-path"));
    });

    util.reset();
});