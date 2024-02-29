var data; 
const itemsPerPage = 3;
let currentPage = 1;

async function loadIndex() {
    try {
        const response = await fetch(dataLocation);
        data = await response.json();
        loginUser(localStorage.username);
    } catch (error) {
        console.error('Failed to load data!', error);
    }
}

function displayPageData(user) {
    userData = data[user];
    displayTransactionTable(userData);
    displaySpendingOverview(userData);
    displayOverviewText(userData)
    document.getElementById('load-more').style.display = 'block';
}

function displayTransactionTable(userData) {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const transactions = userData.transactionHistory.slice(startIndex, endIndex);

    if (currentPage === 1) {
        document.querySelector("tbody").innerHTML = "";
    }

    transactions.forEach(transaction => {
        let frequency = transaction.recurring ? "Recurring" : "One-Time";
        let type = transaction.type === "credit" ? "add" : "subtract";
        document.querySelector("tbody").innerHTML += `
        <tr title="View more details about your transaction" onclick="window.location.href='transaction-detail.html?id=${transaction.id}'" class="${type} recurring-${transaction.recurring}">
            <td>${transaction.date}</td>
            <td class="caps">${transaction.category}</td>
            <td>${transaction.vendor}</td>
            <td>$${transaction.amount}</td>
            <td>${frequency}</td>
        </tr>`;
    });

    if (endIndex >= userData.transactionHistory.length) {
        document.getElementById('load-more').style.display = 'none';
    }
    
}

document.getElementById('load-more').addEventListener('click', function() {
    currentPage++;
    displayTransactionTable(data[localStorage.username]);
});




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

function readDate() {
    date = userData.transactionHistory[0].date.split("-")
    date = new Date(date[0], date[1], date[2])
    return date
}

let overview = {
    wants: 0,
    needs: 0,
    income: 0,
    idealWants: 0,
    idealNeeds: 0,
    idealSavings: 0,
}

function transactionsToOverview() {
    //update dates from strings to Dates
    first = Date.parse(userData.spendingHistory[0].dates[0])
    second = Date.parse(userData.spendingHistory[0].dates[1])
    // calculate needs/wants/income for current time
    userData.transactionHistory.forEach(function(transaction) {
        between = Date.parse(transaction.date).between(first, second)                   // true|false
        if (between) {
            if (transaction.category == "need") {
                overview.needs = overview.needs + transaction.amount
            }
            else if (transaction.category == "income") {
                overview.income = overview.income + transaction.amount
            }
            else {
                overview.wants = overview.wants + transaction.amount
            }
        }
    })
    //calculate ideal need/wants
    overview.idealNeeds = userData.spendingHistory[0].needs * overview.income
    overview.idealWants = userData.spendingHistory[0].wants * overview.income
    overview.idealSavings = userData.spendingHistory[0].savings * overview.income


    return overview
    
}

