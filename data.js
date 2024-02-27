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
    
}

function displayIndexData(user) {
    // until more work is done, i'm sticking to a single user
    userData = data[user];
    displayTransactionTable(userData);
    displaySpendingHistory(userData);
    
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
        <td>${transaction.type}</td>
        <td>${transaction.vendor}</td>
        <td>$${transaction.amount}</td>
        <td>${frequency}</td>
        </tr>`
    })
    
}

$(document).on("click", "#login-button", function() {
    username = $("#username").val();
    console.log(username)

    if(!userShown){
        if (username in data) {  
            console.log("success!");
            userShown = true;
            $("#content").css("display", "block");
            $("#login").css("display", "none");
            displayIndexData(username);
        }
    }
});


function displaySpendingHistory(userData) {
    budget = userData.spendingHistory[0].budget
    spending = userData.spendingHistory[0].spending
    percentage = spending/budget * 100
    document.querySelector("#spending-history .progress-bar").style.width = `${percentage}%`
    document.querySelector('.percent').innerHTML = `${Math.round(100-percentage)}%`
}
