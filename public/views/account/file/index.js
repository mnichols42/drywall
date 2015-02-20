(function() {
  'use strict';
  
  $(document).ready(function() {
    var hashOfFile = document.URL.split('/').pop();
    var imageArea = $('img#uploadedFileImage');
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
    
    var params = {Key: hashOfFile};
    s3bucket.getSignedUrl('getObject', params, function (err, imageUrl) {
      console.log(err ? err : imageUrl);
      
      if (!err) {
        imageArea.attr('src', imageUrl);
      }
    });
  });
}());
