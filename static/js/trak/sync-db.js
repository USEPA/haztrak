$(document).ready(function() {
$(function(){
    $('#sync-manifest').on('click', function(){
        let syncURL = "/trak/sync/"
       $.get(syncURL, function(data) {
           alert("Data: " + data)
       })
    });
});
});