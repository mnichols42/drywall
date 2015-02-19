(function() {
  'use strict';
  
  $("form#uploadForm").submit(function(event) {
    event.preventDefault();
    
    var reader = new FileReader();
    var $fileInput = $('input#selectedFile')[0];
    var uploadFile = $fileInput.files[0];
    
    reader.onloadend = function() {
      var hash;
      
      /* jshint ignore:start */
      hash = CryptoJS.SHA1(reader.result).toString();
      /* jshint ignore:end */
      
      console.log("SHA-1 hash of file: " + hash);
      
      $.ajax({
        type: "POST",
        url: "/account/upload/hash/",
        data: {
          hash: hash
        },
        success: function() {
          var s3bucket;
          
          var cognitoParams = {
            AccountId: '590523376012',
            RoleArn: 'arn:aws:iam::590523376012:role/Cognito_AudiverisUnauth_Role',
            AllowUnauthenticatedIdentities: false,
            IdentityPoolId: 'us-east-1:e99bfbf2-766c-4edc-870f-9531273f4985'
          };
          
          AWS.config.region = 'us-east-1';
          AWS.config.credentials = new AWS.CognitoIdentityCredentials(cognitoParams);
          
          AWS.config.credentials.get(function(err) {
            if (!err) {
              console.log("Cognito Identity Id: " + AWS.config.credentials.identityId);
            }
          });

          /* jshint ignore:start */
          s3bucket = new AWS.S3({params: {Bucket: 'audiveris-uploads-ca'}});
          /* jshint ignore:end */
          
          if (uploadFile) {
            var params = {Key: hash, ContentType: uploadFile.type, Body: uploadFile};
            s3bucket.upload(params, function (err) {
              console.log(err ? err : "Upload Successful");
            });
          }
        },
        statusCode: {
          409: function() {
            return;
          }
        },
      });
    };
    
    reader.readAsBinaryString(uploadFile);
  });
}());
