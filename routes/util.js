var exec = require("child_process").exec;
var fs = require("fs");

var explorer = function ( path, callback ){
	var currentFilesList = [];
	fs.readdir(path, function ( err, files ){
		if( err )return callback( err );
		var len = files.length;
		if( len > 0 ){
			files.forEach(function (file,i){
				fs.stat(path + file, function ( err, stat ){
					if(err) return;
					currentFilesList.push( stat.isDirectory() ? "file!"+file : file  );
					if(len - 1 === i){
						setTimeout(function (){
							return callback( null, currentFilesList );
						},50);
					}
				});
			});
		}else{
			return callback( null , ['文件夹是空哒~']);
		}
	});
};

var execCommand = function ( cmd, callback ){
	exec(cmd, function (err, stdout, stderr){
		if( err ) return callback( err );
		return callback( null, stdout );
	});
};

module.exports = {
	explorer : explorer,
	execCommand : execCommand
};