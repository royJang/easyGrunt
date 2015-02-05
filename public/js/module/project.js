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
		projectPack : function (name){
			return "p!" + name;
		},
		create : function ( name, callback ){
			return storage.setItem( this.projectPack(name), { "name" : name }, function (err, data){
				return defaultCallback(err) && callback(err,data);
			});
		},
		remove : function ( name, callback ){
			return storage.removeItem( this.projectPack(name), function (err,data){
				return defaultCallback(err) && callback(err,data);
			});
		},
		update : function ( name, data, callback ){
			return storage.setItem( this.projectPack(name), data, function (err,data){
				return defaultCallback(err) && callback(err,data);
			});
		},
		getProjectLists : function ( callback ){
			storage.keys(function ( err, data ){
				return callback( err, data );
			});
		},
		updateProjectActive : function ( name, callback ){
			storage.setItem("EG-project-active", { "name" : name } ,callback);
		},
		getProjectActive : function ( callback ){
			storage.getItem("EG-project-active",callback);
		}
	};

	return Project;
});