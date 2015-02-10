define("index", ['jQuery', 'underscore', 'async', 'util', 'variable', 'project', 'file', 'address', 'prompt', 'plugin' ],
    function ( jquery, _, async, Util, v, Project, File, Address, Prompt, Plugin ){

    var util = new Util();
    var file = new File();
    var project = new Project();
    var address = new Address();
    var prompt = new Prompt();
    var plugin = new Plugin();

    //@url : 文件路径
    //根据@url 跳转至相应的文件路径
    //如果没有默认的工作区域，默认跳转至C盘根目录
    var jump = function ( url ){
       if( !url ) url = "C:/";
       address.set(url) && file.getFileList( url );
    };

    //@projectName : 項目名稱，
    //拉取 @projectName 的工作區域Url,然後跳轉
    var jumpToProjectUrl = function (projectName,callback){
        project.getProjectUrl( projectName || null, function (err,a){
            jump( a );
            return callback && callback();
        });
    };

    jumpToProjectUrl();

    //地址栏按回车,跳转至响应目录
    $(document).on("keyup",function (e){
        if(e.which === 13) jump(address.get());
    });

    //上一级按钮
    v.filePre.on("click",function (){
        jump($(this).attr("data-path"));
    });

    //绑定事件
    file.reBind();

    /*
    *   Address
    */

    var addressFn = function (){
        $(".icon-heart2").on("click", function (){
            address.love(function (err,data){
                if(err) return prompt.show("工作區域更新失敗..");
                address.loved() && prompt.show("工作區域更新成功!");
            });
        });
    };


    /*
    *   Project
    */

    var projectFn = function (){
        var projectEvents = function (){
            //移除项目
            $(".removeProject").off("click").on("click", function (){
                var projectName = $(this).parent().find(".projectTitle").text();
                if(confirm("您確定刪除 <"+ projectName +"> 嗎？")){
                    project.remove(projectName, function( err,data ){
                        if(!err) getProjectList();
                    });
                }
            });
            var projectListItem = $(".project-lists").find("li");
            //项目切换
            projectListItem.off("click").on("click", function (){
                var self  = this,
                    cel = $(self),
                    text = cel.find(".projectTitle").text();
                projectListItem.removeClass("active") && cel.addClass("active");
                project.updateProjectActive(text, function (err,data){
                    if(err){
                        prompt.show("獲取項目詳細信息失敗!");
                        cel.removeClass("active");
                        return;
                    }
                    jumpToProjectUrl(text);
                });
            });
        };
        var getProjectList = function (){
            return async.series({
                project : function (callback) {
                    project.getProjectLists( callback );
                },
                active : function (callback) {
                    project.getProjectActive( callback );
                }
            }, function (err, result){
                util.renderTemplate({
                    data : {  project : result.project, active : result.active },
                    template : v.projectsTemplate,
                    wrapper : v.projectLists
                });
                projectEvents();
                result.active ? address.status() : jump();
            });
        };
        v.addProject.off("click").on("click", function (){
            var result = window.prompt("请输入新建项目名称：");
            if(result){
                if( result.length === 0 ) result = "easy to Grunt";
                project.create(result, function ( err,data) {
                    if (!err) getProjectList(function (){});
                });
            }
        });

        getProjectList();
    };

    var pluginFn = function (){
        $(".icon-powercord").on("click", function (){
            plugin.show();
        });
        $(".icon-copy2").on("click", function (){

        });
    };

    projectFn();
    addressFn();
    pluginFn();
});