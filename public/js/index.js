define("index", ['jQuery', 'underscore', 'async' , 'util', 'variable', 'project', 'file', 'address', 'prompt' ], function ( jquery, _, async, Util, v, Project, File, Address, Prompt ){

    var util = new Util();
    var file = new File();
    var project = new Project();
    var address = new Address();
    var prompt = new Prompt();

    var jump = function ( url ){
       address.set(url) && file.getFileList( url );
    };

    //获取项目收藏的地址，直接跳转至工作目录
    var jumpToProjectUrl = function (text){
        project.getProjectUrl(text, function (err,a){
            jump(a);
        });
    };

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

    var addressFn = function (){
        $(".icon-heart2").on("click", function (){
            address.love(function (err,data){
                if(err) return prompt.show("收藏失败..");
                prompt.show("收藏成功！");
            });
        });
        $(".icon-heart").on("click", function (){

        });
    };

    var projectFn = function (){
        var projectEvents = function (){
            //移除项目
            $(".removeProject").off("click").on("click", function (){
                var projectName = $(this).parent().find(".projectTitle").text();
                if(confirm("确定删除 <"+ projectName +"> 吗？")){
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
                        prompt.show("获取项目详细信息失败!");
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
            });
        };
        v.addProject.off("click").on("click", function (){
            var result = window.prompt("请输入新建项目名称：");
            if(result){
                if( result.length === 0 ) result = "easy to Grunt";
                project.create(result,function ( err,data) {
                    if (!err) getProjectList(function (){});
                });
            }
        });

        getProjectList();
    };

    projectFn();
    addressFn();

});