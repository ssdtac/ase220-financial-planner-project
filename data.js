const dataLocation = "https:///jsonblob.com/api/jsonBlob/jsonblob.com/1212135446795902976"
const itemsPerPage = 9

var data;
var userShown = false;
async function loadIndex() {
    try {
        const response = await fetch(dataLocation);
        data = await response.json();
    } catch (error) {
        console.error('Failed to load data!', error);
    }
    loginUser(localStorage.username);
}

function displayIndexData(user) {
    // until more work is done, i'm sticking to a single user
    userData = data[user];
    displayTransactionTable(userData);
    displaySpendingHistory(userData);
    
}

function displayTransactionTable(userData) {
    document.getElementById("username").innerText = userData.username;
    
    userData.transactionHistory.forEach(function(transaction) {
        let frequency, type;
        if (transaction.recurring == true) {
            frequency = "Recurring"
        }
        else {
            frequency = "One-Time"
        }
        if (transaction.type == "credit") {
            type = "add"
        }
        else {
            type = "subtract"
        }
        document.querySelector("tbody").innerHTML += `
        <tr class="${type} recurring-${transaction.recurring}">
        <td>${transaction.date}</td>
        <td>${transaction.type}</td>
        <td>${transaction.vendor}</td>
        <td>$${transaction.amount}</td>
        <td>${frequency}</td>
        </tr>`
    })
    
}

$(document).on("click", "#login-button", function() {
    let username = $("#username").val();
    console.log(username);
    loginUser(username);
    localStorage.username = username;
});

$(document).on("click", "#logout-button", function() {
    logoutUser()
});

function loginUser(username) {
    if(!userShown){
        if (username in data) {  
            userShown = true;
            $("#content").css("display", "block");
            $("#login").css("display", "none");
            displayIndexData(username);
        }
    }
}

function logoutUser() {
    if(userShown) {
        localStorage.username = ""
        $("#content").css("display", "none");
        $("#login").css("display", "block");
        userShown = false;
        document.querySelector(".tbody").innerHTML = "";
        document.getElementById("user-title").innerText = "";
    }
}

function displaySpendingHistory(userData) {
    budget = userData.spendingHistory[0].budget
    spending = userData.spendingHistory[0].spending
    percentage = spending/budget * 100
    document.querySelector("#spending-history .progress-bar").style.width = `${percentage}%`
    document.querySelector('.percent').innerHTML = `${Math.round(100-percentage)}%`
}
