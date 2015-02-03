(function() {
  'use strict';

  $.getScript("http://crypto-js.googlecode.com/svn/tags/3.1.2/build/rollups/sha256.js");
  
  $("form#uploadForm").submit(function(event) {
    event.preventDefault();
    
    var reader = new FileReader();
    
    reader.onloadend = function() {
      console.log("SHA-256 hash of file: " + CryptoJS.SHA256(reader.result));
    };
    
    var $fileInput = $('input#selectedFile')[0];
    var uploadFile = $fileInput.files[0];
    reader.readAsBinaryString(uploadFile);
  });
}());
