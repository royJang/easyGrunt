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
		"prompt" : "../util/prompt",
		"project" : "../module/project",
		"index" : "../index"
	},
	shim : {
		"underscore" : {
			exports : "_"
		}
	}
});

require([ "index" ], function ( index  ){});