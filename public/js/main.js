require.config({
	baseUrl : 'js/lib',
	paths : {
		"jQuery" : "jquery",
		"text" : "require.text",
		"async" : "async",
		"localforage" : "localforage.min",
		"util" : "../util/util",
		"variable" : "../util/variable",
		"query" : "../util/query",
		"prompt" : "../util/formation/prompt",
		"project" : "../module/project",
		"file" : "../module/file",
		"address" : "../module/address",
		"index" : "../index"
	},
	shim : {
		"underscore" : {
			exports : "_"
		}
	}
});

require([ "index" ], function ( index  ){});