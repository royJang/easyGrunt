var exec = require("child_process").exec;
var fs = require("fs");

var explorer = function ( path, callback ){
	var currentFilesList = [];
	fs.readdir(path, function ( err, files ){
		if( err )return callback( err );
		var len = files.length;
		files.forEach(function (file,i){
			fs.stat(path + file, function ( err, stat ){
				if(err) return;
				currentFilesList.push( stat.isDirectory() ? "file!"+file : file  );
				if(len - 1 === i) return callback( null, currentFilesList );
			});
		});
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