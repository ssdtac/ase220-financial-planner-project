var userShown = false;


$(document).on("click", "#login-button", function() {
    let username = $("#username").val();
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
        clearPage()
        document.getElementById("user-title").innerText = "";
    }
}

function loginUser(username) {
    if(!userShown){
        if (username in data) {  
            userShown = true;
            displayPageData(username);
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

const dataLocation = "https:///jsonblob.com/api/jsonBlob/jsonblob.com/1212135446795902976"

var data;

async function loadPage() {
    try {
        const response = await fetch(dataLocation);
        data = await response.json();
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

loadPage()