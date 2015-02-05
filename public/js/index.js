define("index", ['jQuery', 'underscore', 'util', 'variable', 'project' ], function ( jquery, _, Util, v, Project ){

    var util = new Util();
    var project = new Project();

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

    var projectFn = function (){
        var projectEvents = function (){
            //移除项目
            $(".removeProject").off("click").on("click", function (){
                var projectName = $(this).parent().text();
                if(confirm("确定删除 <"+ projectName +"> 吗？")){
                    project.remove(projectName, function( err,data ){
                        if(!err) getProjectList();
                    });
                }
            });
            var projectListItem = $(".project-lists").find("li");
            projectListItem.off("click").on("click", function (){
                var self  = this,cel = $(self);
                projectListItem.removeClass("active") && cel.addClass("active");
                project.updateProjectActive($(this).text(),function (err,data){
                    if(err){
                        prompt.show("获取项目详细信息失败!");
                        cel.removeClass("active");
                    }
                });
            });
        };
        var getProjectList = function (){
            project.getProjectLists(function ( err, data ){
                util.renderTemplate({
                    data : {  project : data },
                    template : v.projectsTemplate,
                    wrapper : v.projectLists
                });
                projectEvents();
            });
        };
        v.addProject.off("click").on("click", function (){
            var result = prompt("请输入新建项目名称：");
            if(result){
                if( result.length == 0 ) result = "easy to Grunt";
                project.create(result,function ( err,data) {
                    if (!err) getProjectList();
                });
            }
        });

        getProjectList();
    };

    projectFn();



});