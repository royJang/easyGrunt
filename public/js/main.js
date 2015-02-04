require.config({
	baseUrl : 'js/lib',
	paths : {
		"jQuery" : "jquery",
		"util" : "../util/util",
		"variable" : "../util/variable",
		"query" : "../util/query",
		"index" : "../index"
	},
	shim : {
		"underscore" : {
			exports : "_"
		}
	}
});

require([ "jQuery" , "underscore", "index" ], function ( jQuery, _, index  ){});