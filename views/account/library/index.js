'use strict';

exports.init = function(req, res){  
  req.app.schema.User.getUserUploadHashes(req.user.id, function(err, userUploads) {
    if (!err) {
      console.log(userUploads);
      
      res.render('account/library/index', { uploads: userUploads });
    }
  });
};