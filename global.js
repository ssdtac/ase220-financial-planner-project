var userShown = false;


$(document).on("click", "#login-button", function() {
    let username = document.getElementById("username").value;
    loginUser(username);
});

$(document).on("click", "#logout-button", function() {
    logoutUser();
    location.reload();
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
async function updateJSONBlob(data) {
    const dataLocation = `https://jsonblob.com/api/jsonBlob/${localStorage.blobId}`;

    try {
        const response = await fetch(dataLocation, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const updatedData = await response.json();
            console.log('JSONBlob updated successfully', updatedData);
            alert('Transaction updated successfully');
            location.reload();
            return true;
        } else {
            throw new Error('Failed to update JSONBlob');
        }
    } catch (error) {
        console.error('Error updating JSONBlob:', error);
        alert('Failed to update the transaction.');
        return false;
    }
}


loadPage()