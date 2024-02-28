var userShown = false;


$(document).on("click", "#login-button", function() {
    let username = $("#username").val();
    loginUser(username);
});

$(document).on("click", "#logout-button", function() {
    logoutUser()
});

function loginUser(username) {
    if(!userShown){
        if (username in data) {  
            userShown = true;
            $("main").css("display", "block");
            $("#login").css("display", "none");
            displayPageData(username);
            localStorage.username = username;
        }
        else {
            localStorage.username = ""
            alert("Username does not exist!")
            $("main").css("display", "none");
            $("#login").css("display", "block");
        }
        document.getElementById("username").value = ""
        document.getElementById("user-title").innerText = username;

    }
}

function logoutUser() {
    if(userShown) {
        localStorage.username = ""
        $("main").css("display", "none");
        $("#login").css("display", "block");
        userShown = false;
        clearPage()
        document.getElementById("user-title").innerText = "";
    }
}

var userShown = false;
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
        $("main").css("display", "none");
        $("#login").css("display", "block");
    }
    else {
        loginUser(localStorage.username);

    }
}

loadPage()