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
    loginUser(localStorage.username)

    
}

function displayIndexData(user) {
    userData = data[user];
    displayTransactionTable(userData);
    displaySpendingOverview(userData);
    displayOverviewText(userData)
    
}

function displayTransactionTable(userData) {
    document.getElementById("title-div").innerHTML += `<h2>${userData.username}</h2>`
    
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
        <td class="caps">${transaction.category}</td>
        <td>${transaction.vendor}</td>
        <td>$${transaction.amount}</td>
        <td>${frequency}</td>
        </tr>`
    })
    
}

$(document).on("click", "#login-button", function() {
    username = $("#username").val();
    console.log(username)
    loginUser(username)
    localStorage.username = username


});

function loginUser(username) {

    if(!userShown){
        if (username in data) {  
            console.log("success!");
            userShown = true;
            $("#content").css("display", "block");
            $("#login").css("display", "none");
            displayIndexData(username);
        }
    }
}

function logoutUser() {
    localStorage.username = ""
    $("#content").css("display", "none");
    $("#login").css("display", "block");
}

function displaySpendingOverview(userData) {
    //REWORK ALL OF THIS WITH NEW DATA
    //This should calculate spending automatically from transactions.
    budget = userData.spendingHistory[0].budget
    spending = userData.spendingHistory[0].spending
    let percentage = spending/budget * 100
    document.querySelector("#spending-history .progress-bar").style.width = `${percentage}%`
    document.querySelector('.percent').innerHTML = `${Math.round(100-percentage)}%`

}

function toPercentage(val) {
    val = val * 100
    val = `${val}%`
    return val
}

function displayOverviewText(userData) {
    //using most recent month until i have a way of switching between
    document.querySelector("#summary .needs").innerHTML = toPercentage(userData.spendingHistory[0].needs)
    document.querySelector("#summary .wants").innerHTML = toPercentage(userData.spendingHistory[0].wants)
    document.querySelector("#summary .savings").innerHTML = toPercentage(userData.spendingHistory[0].savings)


}