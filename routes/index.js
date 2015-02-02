var _ = require("underscore");
var util = require("./util");

module.exports = function (app){
  app.get('/',function (req,res){
    util.execCommand('wmic logicaldisk', function ( err, data ){
        if( err ) return;
        var _data = data.match(/[a-z]{1}\:/gi),
            drive = _.union(_data);
        res.render('index', {
          drive : drive
        });
    });
  });
  app.post('/ls', function (req, res){
    var direction = req.body.paths;
    util.explorer(direction, function (err, data){
      return res.send( data );
    })
  });
};