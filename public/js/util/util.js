define('util', [ 'jQuery', 'underscore', 'variable', 'query' ], function ( jquery, _, v , query){

	var q = new query();
	var Util = function (){};

	_.templateSettings = {
		evaluate : /\{%([\s\S]+?)\%\}/g,
		interpolate : /\{%=([\s\S]+?)\%\}/g,
		escape : /\{%-([\s\S]+?)%\}/g
	};

	Util.prototype = {
		constructor : Util,
		currentPaths : [],
		clearData : function (){
			this.currentPaths.length = 0;
			this.currentPaths = [];
			return true;
		},
		formatURL : function ( path ){
			//进来的路径如果找到“:”，则说明是一个盘符，清空当前数组,重新排列
			path.indexOf(":") > -1 && this.clearData();
			//将当前路径push进当前数组
			this.currentPaths.push( path );
			var finallyPath = this.currentPaths.reduce(function ( pre, current, index, array ){
				//如果数组的pre位的len-1位是“/”,分隔符就不用加“/”
				var $join = pre.slice(-1) === "/" ? "" : "/";
				return pre + $join + current;
			});
			//数组已经被拼接为一个字符串,格式大概是这样的 c:/windows/,或者 c:/windows
			//所以要对字符串做一下处理,当字符串的最后一位是“/”时，就不用加“/”了
			if( finallyPath.slice(-1) !== "/" ) finallyPath += "/";
			//赋值进路径展示框
			v.currentReallyPath.val( finallyPath );
			//把最终结果return出去
			return finallyPath;
		},
		renderTemplate : function ( options ){
			var config = {
				template : v.filesListsTemplate,
				wrapper : v.filesLists,
				method : "html",
				data : {}
			};
			var r = _.extend( config, options );
			var render = _.template( r.template );
			var _temp = render( r.data );
			return r.wrapper[ r.method ]( _temp );
		}
	};

	return Util;
});