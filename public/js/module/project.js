define('project', [ "underscore", "async" , "localforage", "prompt", "plugin.data" ], function ( _, async , localforage, Prompt, pluginData ){

	var storage = localforage;

	var prompt = new Prompt();
	var Project = function (){};

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
		projectPack : function ( name ){
			return "p!" + name;
		},
		create : function ( name, callback ){
			var opts = { "name" : name };
			//设置select初始值
			pluginData.forEach(function ( el ){
				opts[ el.name ] = false;
			});
			return storage.setItem( this.projectPack(name), opts, function ( err, data ){
				return defaultCallback( err ) && callback( err, data );
			});
		},
		get : function ( name, callback ){
			return storage.getItem( name, callback );
		},
		remove : function ( name, callback ){
			var self = this;
			this.getProjectActive(function ( err, chunk ){
				prompt.hide();
				if(chunk && (chunk.name === name )) self.deleteProjectActive();
				return storage.removeItem( self.projectPack( name ), function ( err, data ){
					return defaultCallback( err ) && callback( err, data );
				});
			});
		},
		update : function ( name, data, callback ){
			var self = this;
			this.getFinalProjectActive( name, function ( s, cb ){
				var p = self.projectPack( s );
				self.get( p, function ( err, chunk ){
					var r = _.extend( chunk, data );
					storage.setItem( p, r, callback );
					cb( true );
				});
			}, callback)
		},
		updateProjectPluginStatus : function ( data, callback ){
			var self = this;
			this.getProjectPlugin( null, function ( d ){
				var r = _.extend( d, data );
				self.update( null, data, callback );
			});
		},
		//返回当前Project的工作目录
		getProjectUrl : function ( name, callback ){
			var self = this;
			this.getFinalProjectActive( name, function ( s, cb ){
				self.get( self.projectPack( s ), function (err,data){
					data ? cb( err, data.url ) : cb( err, null );
				});
			}, callback);
		},
		//返回当前Project的grunt插件列表及状态
		getProjectPlugin : function ( name, callback ){
			var self = this;
			this.getFinalProjectActive( name, function ( s, cb ){
				var plugins = {};
				self.get( self.projectPack( s ), function (err,data){
					Object.keys( data ).forEach(function ( el ){
						if( el.indexOf("grunt-") > -1 ){
							plugins[ el ] = data[ el ];
						}
					});
					cb( plugins );
				});
			}, callback);
		},
		//返回选中状态的grunt插件列表
		getProjectPluginWithChecked : function ( name, callback ){
			this.getFinalProjectActive( name, function ( s, cb ){
				var plugins = {};
				self.get( self.projectPack( s ), function (err,data){
					Object.keys(data).forEach(function ( el ){
						if( el.indexOf("grunt-") > -1 && data[ el ] ){
							plugins[ el ] = data[ el ];
						}
					});
					cb( plugins );
				});
			},callback);
		},
		//返回Project列表
		getProjectLists : function ( callback ){
			storage.keys( callback );
		},
		//更新Project的Active状态
		updateProjectActive : function ( name, callback ){
			storage.setItem("EG-project-active", { "name" : name } ,callback);
		},
		//获取当前状态为Active的Project
		getProjectActive : function ( callback ){
			storage.getItem("EG-project-active", callback);
		},
		//通过projectName查询当前为active状态的project
		//name为空时，默认取当前active状态的project
		getFinalProjectActive : function ( name, fn, callback ){
			var self = this;
			async.waterfall([
				function ( cb ){
					self.getProjectActive(function ( err, data ){
						data ? cb( err, data.name ) : cb( err, null );
					});
				},
				function ( args, cb ){
					cb( null, args || name );
				}
			].concat(fn || function (){}), callback);
		},
		//删除当前为active状态的project
		deleteProjectActive : function ( callback ){
			storage.removeItem("EG-project-active", callback);
		}
	};
    
	return Project;
});