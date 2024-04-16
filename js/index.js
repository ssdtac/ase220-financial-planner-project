var data;
var users;


const itemsPerPage = 3;
let currentPage = 1;

$(document).on("click", "#login-button", function() {
    //let username = document.getElementById("username").value;
    //loginUser(username);
});



async function createUser(username) {
    const newUser = {
        username: username,
        balance: 0,
        spendingHistory: [
            {
              timeframe: "February 2024",
              dates: [
                "2024-02-01",
                "2024-04-28"
              ],
              needs: 0.5,
              wants: 0.2,
              savings: 0.2
            },
          ],
        transactionHistory: []
    }
    // create new random id
    id = []
    for (let i=0; i<19; i++) { //ids are 19 random numbers
        // no checking for now it will probably not matter

        id.push(Math.floor(10 * Math.random()));
    }
    id = id.join("");
    //console.log(id);
    


    const response = await fetch(`/api/users/${id}`, 
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(newUser)
    });

    if (response.ok) {        
        localStorage.blobId = id; 
    }
}


async function deleteUser(username) {
    let id = users[username].blobId
    const response = await fetch(`/api/users/${id}`, 
    {
        method: 'DELETE',    
    });

    if (response.ok) {        
        console.log("Removed user")
    }
}


document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("addUserButton").addEventListener("click", function() {
        $("#addUserModal").modal("show");
    });

    document.getElementById("saveNewUser").addEventListener("click", async function() {
        let newUsername = document.getElementById("newUsername").value;
        createUser(newUsername).then(function() {
            const newUser = {
                username: newUsername,
                password: document.getElementById("newPassword").value,
                blobId: localStorage.blobId 
            }
            getUsers().then(function() {
                users[newUsername] = newUser;
                setUsers()
            })
            $('#addUserModal').modal('hide');
        });
    });

    document.getElementById('discardUser').addEventListener("click", function() {
        document.getElementById('newUsername').value = '';
        document.getElementById('newPassword').value = '';
    });

    document.getElementById("saveNewTransaction").addEventListener("click", async function() {
        //default value for transaction date should be today if nothing is entered
        if (document.getElementById('transactionDate').value == "") {
            document.getElementById('transactionDate').value = Date.today().toString('yyyy-MM-dd')
        }
        //default value for transaction amount should be 0 if nothing is entered
        if (document.getElementById('transactionAmount').value == "") {
            document.getElementById('transactionAmount').value = 0
        }
        const newTransaction = {
            date: document.getElementById('transactionDate').value,
            type: document.getElementById("transactionType").value,
            vendor: document.getElementById("transactionVendor").value,
            amount: parseFloat(document.getElementById("transactionAmount").value),
            category: document.getElementById("transactionCategory").value,
            description: document.getElementById("transactionDescription").value,
            recurring: document.getElementById('transactionRecurring').value,
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
        <tr title="View more details about your transaction" onclick="window.location.href='transaction?id=${transaction.id}'" class="${type.toLowerCase()} recurring-${transaction.recurring}">
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
    getUserData(localStorage.blobId).then(function() {
        displayTransactionTable(userData);
    });
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
        category = transaction.category.toLowerCase()
        if (between) {
            console.log(category)
            if (category == "need") {
                overview.needs = overview.needs + transaction.amount
            }
            else if (category == "income") {
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
    document.querySelector("#summary .actual-savings").innerHTML = '$'+((100-width)/100)*overview.income


    
    document.querySelector('.percent').innerHTML = `${Math.round(100-overview.needsPercentage-overview.wantsPercentage-overview.savingsPercentage)}%`

}

function displayOverviewText(userData) {
    const timeframe = userData.spendingHistory[selectedTimeframe]
    //using most recent month until i have a way of switching between
    document.querySelector("#summary .ideal-needs").innerHTML = '$'+timeframe.needs*overview.income
    document.querySelector("#summary .ideal-wants").innerHTML = '$'+timeframe.wants*overview.income
    document.querySelector("#summary .needs").innerHTML = '$'+overview.needs
    document.querySelector("#summary .wants").innerHTML = '$'+overview.wants
    
    document.querySelector("#summary .savings").innerHTML = '$'+timeframe.savings*overview.income

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

