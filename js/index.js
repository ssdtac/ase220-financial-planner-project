var data;
var users;


const itemsPerPage = 3;
let currentPage = 1;



async function getUsers() {
    try {
        const response = await fetch(dataLocation);
        users = await response.json();
    } catch (error) {
        console.error('Failed to load data!', error);
    }
}

function getNewId() {
    return 
}


document.querySelector("#transactionCategory").addEventListener("click", function() {
    let val = document.querySelector("#transactionCategory").value;
    if(val == "purchase") {
        // do purchase things
    } else if (val == "deposit") {
        //do deposit things
    }
});

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("saveNewTransaction").addEventListener("click", async function() {
        const newTransaction = {
            date: document.getElementById('transactionDate').value,
            type: document.getElementById("transactionCategory").value,
            vendor: document.getElementById("transactionVendor").value,
            amount: parseFloat(document.getElementById("transactionAmount").value),
            category: document.getElementById("transactionCategory").value,
            description: document.getElementById("transactionDescription").value,
            id: userData.transactionHistory.length, // use ints for IDs, make new Id the current length (0 indexed)
        };
        userData.transactionHistory.unshift(newTransaction); // Adds the new transaction at the beginning of the array

        const success = await updateJSONBlob(userData);
        if(success) {
            console.log("yay");
        } else {
            console.log("something went wrong");
        }
    });
});


function displayPageData() { 
    getUserData(localStorage.blobId).then(function() {
        displayTransactionTable(userData);
        displaySpendingOverview(userData);
        displayOverviewText(userData)
        document.getElementById('load-more').style.display = 'block';
    });
}


function displayTransactionTable(userData) {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const transactions = userData.transactionHistory.slice(startIndex, endIndex);

    if (currentPage === 1) {
        document.querySelector("tbody").innerHTML = "";
    }

    transactions.forEach(transaction => {
        if (transaction.recurring == "false") {
            frequency = "One-Time"
        }
        else {
            frequency = "Recurring"
        }
        let type = transaction.type.toLowerCase() === "deposit" ? "add" : "subtract";
        document.querySelector("tbody").innerHTML += `
        <tr title="View more details about your transaction" onclick="window.location.href='transaction-detail.html?id=${transaction.id}'" class="${type.toLowerCase()} recurring-${transaction.recurring}">
            <td>${Date.parse(transaction.date).toString("MMMM d, yyyy")}</td>
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
    actualSavings: 0
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
    const timeframe = userData.spendingHistory[selectedTimeframe]
    overview.wantsPercentage = overview.wants/overview.income * 100
    overview.needsPercentage = overview.needs/overview.income * 100
    overview.savingsPercentage = overview.idealSavings/overview.income * 100

    document.querySelector("#needs-bar").style.width = `${overview.needsPercentage}%`
    document.querySelector("#wants-bar").style.width = `${overview.wantsPercentage}%`
    document.querySelector("#savings-bar").style.width = `${0}%`


    document.querySelector("#ideal-needs-bar").style.width = `${(timeframe.needs*100)-overview.needsPercentage}%`
    document.querySelector("#ideal-wants-bar").style.width = `${(timeframe.wants*100)-overview.wantsPercentage}%`
    
    const bars = document.querySelectorAll(".progress-bar")
    let width = 0
    bars.forEach(function(bar) {
        width = width + parseInt( bar.style.width.split("%")[0])
    })
    console.log(width)
    document.querySelector("#savings-bar").style.width = `${100-width}%`
    document.querySelector("#summary .actual-savings").innerHTML = 100-width+"%"


    
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

function loadIndex() {
    if (!userShown) {
        getUsers().then(function() {
            loginUser(localStorage.username)
        });
    } else {
        displayPageData();
    }
}

