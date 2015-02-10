define('plugin', [ 'plugin.data', 'util', 'async', 'project', 'prompt' ],
	function ( data, Util, async, Project, Prompt ){

	var util = new Util();
	var project = new Project();
	var prompt = new Prompt();

	var Plugin = function (){
		return this.init.call(this,arguments);
	};

	Plugin.prototype = {
		constructor : Plugin,
		init : function (){
			this.renderTemplate();
		},
		renderTemplate : function (){
			var self = this;
			project.getProjectPlugin( null, function ( d ){
				data.forEach(function (el,i){
					el["status"] = d[Object.keys(d)[i]];
				});
				self.w = util.renderTemplate({
					template : $(".etg-layer-plugin").html(),
					wrapper : $(".etg-layer-plugin"),
					method : "html",
					data : {
						"list" : data
					}
				}).find(".layer");
				self.events();
			});
		},
		events : function (){
			var self = this,
				checked = "icon-checkbox-checked",
				unChecked = "icon-checkbox-unchecked";
			$(".plugin-close,.plugin-cancel").off("click").on("click", function (){
				self.hide();
			});
			$(".plugin-save").off("click").on("click", function (){
				self.save();
			});
			$(".pluginLayer .pluginList").find("li i").on("click", function (){
				var b = $(this).hasClass(unChecked),
					l = function (n){
						return (n ? b : !b) ? unChecked : checked;
					};
				$(this).removeClass(l(true)).addClass(l());
			});
		},
		show : function (){
			this.w.slideDown();
		},
		hide : function (){
			this.w.slideUp();
		},
		save : function (){
			var data = {};
			var self = this;
			$(".pluginLayer .pluginList").find("li i").each(function ( i, el ){
				var b = $(el).attr("class").replace(/icon-checkbox-/,"") === "checked";
				data[$(el).next().text()] = b;
			});
			prompt.show("保存中...");
			project.updateProjectPluginStatus(data,function (){
				prompt.show("保存成功");
				self.hide();
			});
		}
	};

	return Plugin;
});