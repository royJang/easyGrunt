define('plugin', [ 'underscore', 'plugin.data', 'util', 'async', 'project', 'prompt' ],
	function ( _, source, Util, async, Project, Prompt ){

	var util = new Util();
	var project = new Project();
	var prompt = new Prompt();

	var Plugin = function (){
		return this.init.call(this,arguments);
	};

	Plugin.prototype = {
		constructor : Plugin,
		init : function (){
		},
		renderTemplate : function ( callback ){
			var self = this;
			project.getProjectPlugin( null, function ( d ){
				source.forEach(function (el,i){
					el["status"] = d[Object.keys(d)[i]];
				});
                
                var wrapper = $(".etg-layer-plugin"),
                    $temp = wrapper.html(),
                    render = _.template( $temp ),
                    r = render({ "list" : source });
                
                wrapper.html(r);
                self.w = wrapper.find(".layer");
				
                self.events();
                return callback && callback();
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
					l = function ( n ){
						return ( n ? b : !b ) ? unChecked : checked;
					};
				$(this).removeClass(l(true)).addClass(l());
			});
		},
		show : function (){
            var self = this;
            this.renderTemplate(function (){
                self.w.slideDown();
            });
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