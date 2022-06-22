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
        li.classList.add("d-flex")
        li.classList.add("justify-content-between")
        let newMtn = document.createElement("p")
        newMtn.innerText = Object.keys(mtn)[0]
        li.appendChild(newMtn)
        if (mtn[Object.keys(mtn)[0]] === 200) {
            let newMtnStatus = document.createElement("i")
            newMtnStatus.classList.add("fa-solid")
            newMtnStatus.classList.add("fa-circle-check")
            newMtnStatus.classList.add("text-success")
            li.appendChild(newMtnStatus)
        } else {
            let newMtnStatus = document.createElement("i")
            newMtnStatus.classList.add("fa-solid")
            newMtnStatus.classList.add("fa-circle-xmark")
            newMtnStatus.classList.add("text-danger")
            li.appendChild(newMtnStatus)
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
