// Todo A lot can be improved here, this is mostly prototype code at best :|

function pullMtn() {
    const mtnInput = document.getElementById("pullMtnInput").value
    const csrfToken = getCookie('csrftoken');
    let mtnArray = mtnInput.split(" ")
    let data = {'mtn': mtnArray}
    const options = {
        "method": 'POST',
        "body": JSON.stringify(data),
        "headers": {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken
        }
    }
    fetch("http://127.0.0.1:8000/api/rcrainfo/manifest-pull", options)
        .then(response => response.json())
        .then(response => outputPullMtn(response))
        .catch(err => console.log(err))
}

function outputPullMtn(response) {
    let pullMtnRespList = document.getElementById("pullMtnRespList")
    response.mtn.forEach((mtn) => {
        let li = document.createElement("li")
        li.classList.add("d-flex", "justify-content-between")
        let newMtn = document.createElement("p")
        newMtn.innerText = Object.keys(mtn)[0]
        newMtn.classList.add("h4", "font-weight-bold")
        li.appendChild(newMtn)
        let wrapStatusDiv = document.createElement("div")
        wrapStatusDiv.classList.add("d-inline")
        let newMtnStatus = document.createElement("i")
        newMtnStatus.classList.add("fa-xl", "fa-solid")
        let status = Boolean(mtn[Object.keys(mtn)[0]] < 200 && mtn[Object.keys(mtn)[0]] > 300)
        if (status) {
            newMtnStatus.classList.add("fa-circle-check", "text-success")
            wrapStatusDiv.appendChild(newMtnStatus)
            li.appendChild(wrapStatusDiv)
        } else {
            newMtnStatus.classList.add("fa-circle-xmark", "text-danger")
            wrapStatusDiv.appendChild(newMtnStatus)
            li.appendChild(wrapStatusDiv)
        }
        pullMtnRespList.appendChild(li)
    })
}

// Comes from Django docs here https://docs.djangoproject.com/en/4.0/ref/csrf/
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
