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
    userData = data[user]
    console.log()
    document.getElementById("title-div").innerHTML += `<h2>${userData.username}</h2>`
    
    userData.transactionHistory.forEach(function(transaction) {
        let frequency;
        if (transaction.recurring = true) {
            frequency = "Recurring"
        }
        else {
            frequency = "One-Time"
        }
        document.querySelector("tbody").innerHTML += `
        <tr>
        <td>${transaction.date}</td>
        <td>${transaction.type}</td>
        <td>${transaction.vendor}</td>
        <td>$${transaction.amount}</td>
        <td>${frequency}</td>
        </tr>`
    })
    
    document.getElementById("transaction-history").innerHTML += userData.transactionHistory[0]
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