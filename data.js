const itemsPerPage = 9



function displayPageData(user) {
    userData = data[user];
    displayTransactionTable(userData);
    displaySpendingOverview(userData);
    displayOverviewText(userData)
    
}

function displayTransactionTable(userData) {    
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
        <td><button class="details-button" onclick="window.location.href='transaction-detail.html?id=${transaction.id}'">See More Details</button></td>
        </tr>`
    })
    
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

function clearPage() {
    document.querySelector("tbody").innerHTML = "";

}