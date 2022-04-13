$(document).ready(function() {
$(function(){
    $('#sync-manifest').on('click', function(){
        let syncURL = "/api/sync/"
       $.get(syncURL, function(data) {
           alert("Data: " + data)
       })
    });
});
});