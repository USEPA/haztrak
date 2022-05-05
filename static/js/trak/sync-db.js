$(document).ready(function () {
    $(function () {
        $('#sync-manifest').on('click', function () {
            let epaId = this.getAttribute('data-name');
            let syncURL = "/api/sync/" + epaId
            console.log(syncURL)
            $.get(syncURL, function (data) {
                alert("Data: " + data)
            })
        });
    });
});
