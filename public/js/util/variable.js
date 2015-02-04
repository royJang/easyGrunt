define('variable', [ 'jQuery' ], function ( jquery ){

	var v = {
		currentReallyPath : $(".currentReallyPath"),
		drives : $(".drives"),
		filesLists : $(".filesLists"),
		filesListsTemplate : $(".filesLists").text(),
		pathCtrl : $(".pathController"),
		back : $(".pathController .back"),
		forward : $(".pathController .forward"),
		filePre : $(".file-pre")
	};

	return v;
});