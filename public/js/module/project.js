define('project', [ "underscore", "async" , "localforage", "prompt" ], function ( _, async , localforage, Prompt ){

	var storage = localforage;

	var prompt = new Prompt();
	var Project = function (){};
	var timer = null,
		timer2 = null;

	var defaultCallback = function ( err ){
		if( err ){
			prompt.show('ERROR:失败！');
			return false;
		}
		prompt.show('success！');
		return true;
	};

	Project.prototype = {
		constructor : Project,
		create : function ( name, callback ){
			return storage.setItem( "p!" + name, { "name" : name }, function (err, data){
				return defaultCallback(err) && callback(err,data);
			});
		},
		remove : function ( name, callback ){
			return storage.removeItem( name, function (err,data){
				return defaultCallback(err) && callback(err,data);
			});
		},
		update : function ( name, data, callback ){
			return storage.setItem( name, data, function (err,data){
				return defaultCallback(err) && callback(err,data);
			});
		},
		getProjectLists : function ( callback ){
			storage.keys(function ( err, data ){
				return callback( err, data );
			});
		},
		updateProjectActive : function ( name, callback ){
			storage.setItem("EG-project-active", { "name" : name } ,function ( err ){

			});
		}
	};

	return Project;
});