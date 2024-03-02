var userShown = false;


$(document).on("click", "#login-button", function() {
    let username = document.getElementById("username").value;
    loginUser(username);
});

$(document).on("click", "#logout-button", function() {
    logoutUser();
});

function changeDisplays(login, username) {
    if (login) {
        $("main, #logout-banner, #top-buttons").css("display", "block");
        $("#login").css("display", "none");
        document.getElementById("username").value = ""
        document.getElementById("user-title").innerText = username;
    } else {
        $("main, #logout-banner, #top-buttons").css("display", "none");
        $("#login").css("display", "block");
        clearPage();
        document.getElementById("user-title").innerText = "";
    }
}

var userData;

async function getUserData(blobId) {
    try {
        let response = await fetch("https:///jsonblob.com/api/jsonBlob/jsonblob.com/"+blobId);
        userData = await response.json();
    } catch (error) {
        console.error('Failed to load user data!', error);
    }
}

function loginUser(username) {
    if(!userShown){
        if (username in users) {  
            userShown = true;
            localStorage.blobId = users[username].blobId;
            displayPageData(username)
            localStorage.username = username;
        } else {
            localStorage.username = ""
            alert("Username does not exist!")
        }
        changeDisplays(userShown, username);
    }
}

function logoutUser() {
    if(userShown) {
        localStorage.username = ""
        userShown = false;
    }
    changeDisplays(userShown, "");
}



const dataLocation = "https://jsonblob.com/api/jsonBlob/jsonblob.com/1213035252695293952"
var users;


async function loadPage() {
    try {
        const response = await fetch(dataLocation);
        users = await response.json();
    } catch (error) {
        console.error('Failed to load data!', error);
    }
    if ((localStorage.username == '') || (localStorage.username == undefined)) {
        changeDisplays(false);
    }
    else {
        loginUser(localStorage.username);

    }
}

// Update JSONBlob
function updateJSONBlob(data) {
    const dataLocation = `https://jsonblob.com/api/jsonBlob/${localStorage.blobId}`;
    
    fetch(dataLocation, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(updatedData => {
        console.log('JSONBlob updated successfully', updatedData);
        alert('Transaction updated successfully');
    }).then(location.reload())
    .catch(error => console.error('Error updating JSONBlob:', error));
}

loadPage()