define('project', [ "underscore", "async" , "localforage", "prompt" ], function ( _, async , localforage, Prompt ){

	var storage = localforage;

	var prompt = new Prompt();
	var Project = function (){};
	var timer = null,
		timer2 = null;

	var defaultCallback = function ( err ){
		if( err ){
			prompt.show( 'ERROR:失败！' );
			return false;
		}
		prompt.show( 'success！' );
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
		get : function ( name, callback ){
			return storage.getItem( name, callback );
		},
		remove : function ( name, callback ){
			var self = this;
			this.getProjectActive(function ( err, chunk ){
				if(chunk.name === name ) self.deleteProjectActive();
				return storage.removeItem( self.projectPack(name), function (err,data){
					return defaultCallback(err) && callback(err,data);
				});
			});
		},
		update : function ( name, data, callback ){
			var p = this.projectPack(name);
			this.get(p, function ( err, chunk ){
				var r = _.extend(chunk, data);
				return storage.setItem( p, r, callback);
			});
		},
		getProjectUrl : function ( name, callback ){
			return storage.getItem( this.projectPack(name), function ( err, data ){
				return callback( err, data.url );
			})
		},
		getProjectLists : function ( callback ){
			storage.keys(callback);
		},
		updateProjectActive : function ( name, callback ){
			storage.setItem("EG-project-active", { "name" : name } ,callback);
		},
		getProjectActive : function ( callback ){
			storage.getItem("EG-project-active", callback);
		},
		deleteProjectActive : function ( callback ){
			storage.removeItem("EG-project-active", callback);
		}
	};

	return Project;
});