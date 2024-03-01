var data;
var users;


const itemsPerPage = 3;
let currentPage = 1;

async function loadIndex() {
    try {
        const response = await fetch(dataLocation);
        users = await response.json();
        loginUser(localStorage.username);
    } catch (error) {
        console.error('Failed to load data!', error);
    }
}




function displayPageData() {
    getUserData(localStorage.blobId).then(function() {
        displayTransactionTable(userData);
        displaySpendingOverview(userData);
        displayOverviewText(userData)
        document.getElementById('load-more').style.display = 'block';
    })
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
    displayPageData();
});



function toPercentage(val) {
    val = val * 100
    val = `${val}%`
    return val
}

function clearPage() {
    document.querySelector("tbody").innerHTML = "";

}

function readDate() {
    date = userData.transactionHistory[selectedTimeframe].date.split("-")
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
    wantsPercentage: 0,
    needsPercentage: 0,
    savingsPercentage: 0,
}

function calculateOverview(userData) {
    const timeframe = userData.spendingHistory[selectedTimeframe]
    //update dates from strings to Dates
    first = Date.parse(timeframe.dates[0])
    second = Date.parse(timeframe.dates[1])
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
    overview.idealNeeds = timeframe.needs * overview.income
    overview.idealWants = timeframe.wants * overview.income
    overview.idealSavings = timeframe.savings * overview.income


    return overview
    
}

let selectedTimeframe = 0;

function displaySpendingOverview(userData) {
    calculateOverview(userData)
    //REWORK ALL OF THIS WITH NEW DATA
    //This should calculate spending automatically from transactions.
    overview.wantsPercentage = overview.wants/overview.income * 100
    overview.needsPercentage = overview.needs/overview.income * 100
    overview.savingsPercentage = overview.idealSavings/overview.income * 100

    document.querySelector("#needs-bar").style.width = `${overview.needsPercentage}%`
    document.querySelector("#wants-bar").style.width = `${overview.wantsPercentage}%`
    document.querySelector("#savings-bar").style.width = `${overview.savingsPercentage}%`

    document.querySelector('.percent').innerHTML = `${Math.round(100-overview.needsPercentage-overview.wantsPercentage-overview.savingsPercentage)}%`

}

function displayOverviewText(userData) {
    const timeframe = userData.spendingHistory[selectedTimeframe]
    //using most recent month until i have a way of switching between
    document.querySelector("#summary .ideal-needs").innerHTML = toPercentage(timeframe.needs)
    document.querySelector("#summary .ideal-wants").innerHTML = toPercentage(timeframe.wants)
    document.querySelector("#summary .needs").innerHTML = `${overview.needsPercentage}%`
    document.querySelector("#summary .wants").innerHTML = `${overview.wantsPercentage}%`
    
    document.querySelector("#summary .savings").innerHTML = toPercentage(timeframe.savings)


}