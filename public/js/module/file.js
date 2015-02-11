define('file', ['util', 'async' , 'query', 'address', 'project'], function ( Util, async, Query, Address, Project ){

	var util = new Util(),
		q = new Query(),
		project = new Project(),
		address = new Address();
	var File = function (){};
	File.prototype = {
		constructor : File,
		getFileList : function ( path, callback ){
			var self = this;
			var preBtn = $(".file-pre");
			var p = util.formatURL( (Array.isArray(path) ? path[0] : path) );
			q.getFileList( p, function ( err, data ){
				util.renderTemplate({ data : { "files" : data } }) && self.reBind();
				var n = p.split("/");
				n.splice(-2,2);
				var prePath = n.join("/") + "/";
				preBtn.attr({"data-path":prePath});
				$(".currentReallyPath").val().length > 3 ? preBtn.show() : preBtn.hide();
				project.getProjectUrl(null,function ( err, url ){
					address.status( url );
					return callback && callback( err, data );
				});
			});
		},
		reBind : function ( obj ){
			var self = this,
                fn = function ( obj, b ){
                    var $dataPath =  b == true ? obj.attr("data-path") : obj.parent().attr("data-path");
                    if( !$dataPath ) return;
                    //file!说明是一个文件夹,没有则是一个普通文件
                    var _data = $dataPath.indexOf("file!") > -1 ? $dataPath.replace("file!", "") : $dataPath;
                    self.getFileList( _data );
                };
            
            $(".drives .drivesItem").off("click").on("click", function (){
                fn($(this),true);
            });
            
			return $(".filesLists li .fileName").off("click").on("click", function (){
				fn($(this),false);
			});
		}
	};

	return File;
});