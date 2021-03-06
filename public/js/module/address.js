define('address', [ 'variable', 'prompt', 'project' ], function ( v, Prompt, Project ){

	var prompt = new Prompt();
	var project = new Project();
	var Address = function (){};

	Address.prototype = {
		constructor : Address,
		//获取地址栏的内容
		get : function (){
			return v.currentReallyPath.val();
		},
		//@url : 地址栏目录
		//更新地址栏目录
		set : function ( url ){
			return v.currentReallyPath.val( url );
		},
		//保存当前工作区域路径
		love : function ( callback ){
			var self = this;
			//获取当前地址栏路径,没有则提示 然后return掉
			if( !this.get()) return prompt.show("地址栏是空哒~,不能保存!");
			//获取当前激活的工作项目,如果没有项目，则提示 然后return掉
			project.getProjectActive(function (err,data){
				if( !data ) return prompt.show("选择一个项目先~");
				//更新当前激活项目的url
				project.update(data.name,{ "url" : self.get() }, callback);
			});
		},
        addCheckbox : function (){
            return $("ul.filesLists li").each(function ( i, el ){
                if( $(el).find(".fileChoose").length > 0 || $(el).find(".fileName").text().indexOf("空") > -1 ) return;
                $("<div class='fileChoose'><input type='checkbox' /></div>").insertBefore($(el).find(".fileName"));
            });
        },
        showAddTasksBtn : function (){
            
        },
		status : function (){
			var self = this;
			project.getProjectUrl(null, function (err,url){
				//self.get 是当前地址栏
				//url 是项目地址
				//当地址栏.indexOf url > -1 时，说明当前地址是项目地址，或者是项目地址的子目录
                //让他们都标示已经loved
                self.get().indexOf(url) > -1 ? self.loved() : self.loveBroken();
			});
		},
		loved : function (){
			return this.addCheckbox() && $(".projectLove").removeClass("icon-heart2").addClass("icon-heart");
		},
		loveBroken : function (){
			return $(".projectLove").removeClass("icon-heart").addClass("icon-heart2");
		}
	};

	return Address;
});