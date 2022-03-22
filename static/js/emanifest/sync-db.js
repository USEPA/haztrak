$(document).ready(function() {
$(function(){
    $('#sync-manifest').on('click', function(){
       $.get("/emanifest/sync/3", function(data) {
           alert("Data: " + data)
       })
    });
});
});