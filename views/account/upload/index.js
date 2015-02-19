'use strict';

exports.init = function(req, res){
  res.render('account/upload/index');
};

exports.uploadHash = function(req, res) {
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('uploadHash', function() {
    req.app.schema.User.associateFileHash(req.user.id, req.body.hash, function() {
      return;
    });

    return workflow.emit('response');
  });
  
  workflow.emit('uploadHash');
};