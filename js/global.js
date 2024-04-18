var userShown = false;
urlParams = new URL(window.location.href).searchParams, 


$(document).on("click", "#login-button", function() {
    let username = document.getElementById("username").value;
    let passsword = document.getElementById("password").value;

    loginUser(username, passsword);
});

$(document).on("click", "#logout-button", function() {
    logoutUser();
    location.reload();
});

$(document).on("change", "#transactionType", function() {
    if (document.getElementById("transactionType").value == "deposit") {
        document.getElementById("transactionCategory").selectedIndex = 2
    }
    else {
        document.getElementById("transactionCategory").selectedIndex = 0
    }
});

function clearPage() {
    document.querySelector("tbody").innerHTML = "";

}

function changeDisplays(login, username) {
    if (login) {
        $("main, #logout-banner, #top-buttons-login").css("display", "block");
        $("#login, #top-buttons-logout").css("display", "none");
        document.getElementById("username").value = ""
        document.getElementById("user-title").innerText = username;
    } else {
        $("main, #logout-banner, #top-buttons-login").css("display", "none");
        $("#login, #top-buttons-logout").css("display", "block");
        clearPage();
        document.getElementById("user-title").innerText = "";
    }
}

var userData;

async function getUserData(blobId) {
    try {
        let response = await fetch("/api/users/"+blobId);
        userData = await response.json();
    } catch (error) {
        console.error('Failed to load user data!', error);
    }
}

async function loginUser(username, password) {
    console.log(username, password)
    let response = await fetch("/api/findid/"+username+"/"+password);
        data = await response.json();
        console.log(data)
    if(!userShown){
        if (response.ok) {  
            userShown = true;
            localStorage.blobId = data._id;
            displayPageData(data.username)
        } else {
            localStorage.username = ""
            alert("Username does not exist!")
        }
        changeDisplays(userShown, data.username);
    }
}


function logoutUser() {
    if(userShown) {
        localStorage.username = ""
        userShown = false;
    }
    changeDisplays(userShown, "");
}



const dataLocation = "/api/users.json"
var users;


async function loadPage() {
    if ((localStorage.username == '') || (localStorage.username == undefined)) {
        changeDisplays(false);
    }
    else {
        // loginUser(localStorage.username);

    }
}

// Update JSONBlob
async function updateJSONBlob(data) {
    const dataLocation = `/api/users/${localStorage.blobId}`;

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

function readDate() {
    date = userData.transactionHistory[selectedTimeframe].date.split("-")
    date = new Date(date[0], date[1], date[2])
    return date
}


loadPage()