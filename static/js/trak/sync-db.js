$(document).ready(function() {
$(function(){
    $('#sync-manifest').on('click', function(epaSiteID){
        let syncURL = "/trak/sync/" + epaSiteID
       $.get(syncURL, function(data) {
           alert("Data: " + data)
       })
    });
});
});