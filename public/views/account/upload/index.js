(function() {
  'use strict';

  $.getScript("http://crypto-js.googlecode.com/svn/tags/3.1.2/build/rollups/sha256.js");
  
  $("form#uploadForm").submit(function(event) {
    event.preventDefault();
    
    var reader = new FileReader();
    
    reader.onloadend = function() {
      //var hash = CryptoJS.SHA256(reader.result);
      var hash = "hello-world!";
      
      console.log("SHA-256 hash of file: " + hash);
      
      $.ajax({
        type: "POST",
        url: "/account/upload/hash/",
        data: {
          hash: hash
        },
        success: function() {
          $.ajax({
            type: "POST",
            url: "/account/upload/",
            dataType: "json",
            processData: false,
//            contentType: false,
            data: {
              hash: hash,
              file: reader.result
            }
          });
        },
        statusCode: {
          409: function() {
            return;
          }
        },
      });
    };
    
    var $fileInput = $('input#selectedFile')[0];
    var uploadFile = $fileInput.files[0];
    reader.readAsBinaryString(uploadFile);
  });
}());
