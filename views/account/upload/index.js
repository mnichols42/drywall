'use strict';

exports.init = function(req, res){
  res.render('account/upload/index');
};

exports.uploadHash = function(req, res) {
  var workflow = req.app.utility.workflow(req, res);

//  workflow.on('uploadHash', function() {
//    if (!req.body.email) {
//      workflow.outcome.errfor.email = 'required';
//    }
//    else if (!/^[a-zA-Z0-9\-\_\.\+]+@[a-zA-Z0-9\-\_\.]+\.[a-zA-Z0-9\-\_]+$/.test(req.body.email)) {
//      workflow.outcome.errfor.email = 'invalid email format';
//    }
//
//    if (workflow.hasErrors()) {
//      return workflow.emit('response');
//    }
//
//    workflow.emit('upload');
//  });
//
//  workflow.emit('uploadHash');
  console.log(req.body);
  
  workflow.emit('response');
};

exports.uploadFile = function(req, res) {
  var workflow = req.app.utility.workflow(req, res);

//  workflow.on('uploadHash', function() {
//    if (!req.body.email) {
//      workflow.outcome.errfor.email = 'required';
//    }
//    else if (!/^[a-zA-Z0-9\-\_\.\+]+@[a-zA-Z0-9\-\_\.]+\.[a-zA-Z0-9\-\_]+$/.test(req.body.email)) {
//      workflow.outcome.errfor.email = 'invalid email format';
//    }
//
//    if (workflow.hasErrors()) {
//      return workflow.emit('response');
//    }
//
//    workflow.emit('upload');
//  });
//
//  workflow.emit('uploadHash');
  
  console.log(req.body);
  
  var params = {
    Bucket : 'audiveris-uploads-ca',
    Key : 'test1',
    Body : req.body.file
  };
  
  req.app.s3.upload(params, function(err, data) {
    if (err) {
      console.log(err);
    } else {
      console.log("Successful file upload!");
    }
  });
  
  workflow.emit('response');
};