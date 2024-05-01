function displayTransactionDetails(transaction) {
    if (transaction) {
        document.getElementById('transaction-details').innerHTML = ""
        if (transaction.recurring == "false") {
            frequency = "One-Time"
        }
        else {
            frequency = "Recurring"
        }
        
        addDetail("Date", transaction.date)
        addDetail("Vendor", transaction.vendor)
        addDetail("Amount", `$${transaction.amount}`)
        addDetail("Category", transaction.category)
        addDetail("Description", transaction.description)
        addDetail("Recurring", frequency)
    } else {
        document.getElementById('transaction-details').innerText = 'Transaction details not found.';
    }
}

async function getUserData(blobId) {
    try {
        let response = await fetch("/api/users/"+blobId);
        userData = await response.json();
    } catch (error) {
        console.error('Failed to load user data!', error);
    }
}


function addDetail(type, data) {
    document.getElementById('transaction-details').innerHTML +=             
    `<div class="transaction">
        <h3>${type}</h3> 
        <p class="caps">${data}</p>
    </div>`


}

function findTransactionById(id) {
        const transaction = userData.transactionHistory.find(transaction => transaction.id === parseInt(id));
        if (transaction) {
            return transaction;
        }
    return null;
}
function goHome() {
    location.href = `dashboard?token=${localStorage.token}`
}
async function displayPageData() {
    const urlParams = new URLSearchParams(window.location.search);
    const transactionId = urlParams.get('id');
    if (transactionId) {
        getUserData(localStorage.blobId).then( function() {
            const transactionDetails = findTransactionById(transactionId);
            displayTransactionDetails(transactionDetails);
            setupEditAndDeleteButtons(transactionDetails, userData, transactionId);
            document.getElementById("user-title").innerText = userData.username

        });
    } else {
        document.getElementById('transaction-details').innerText = 'Transaction ID not provided in the URL.';
    }
}


function setupEditAndDeleteButtons(transaction, data, transactionId) {
    // Clone the edit button to remove all event listeners
    var oldEditButton = document.getElementById('edit-transaction');
    var newEditButton = oldEditButton.cloneNode(true);
    oldEditButton.parentNode.replaceChild(newEditButton, oldEditButton);

    // Clone the delete button to remove all event listeners
    var oldDeleteButton = document.getElementById('delete-transaction');
    var newDeleteButton = oldDeleteButton.cloneNode(true);
    oldDeleteButton.parentNode.replaceChild(newDeleteButton, oldDeleteButton);

    // Attach the event listeners to the new buttons
    newEditButton.addEventListener('click', () => showEditModal(transaction, transactionId));
    newDeleteButton.addEventListener('click', () => deleteTransaction(transactionId, data));
}


function showEditModal(transaction, transactionId) {
    document.getElementById('transactionDate').value = transaction.date;
    document.getElementById('transactionVendor').value = transaction.vendor;
    document.getElementById('transactionAmount').value = transaction.amount;
    document.getElementById('transactionCategory').value = transaction.category;
    document.getElementById('transactionDescription').value = transaction.description;
    document.getElementById('transactionType').value = transaction.type;
    document.getElementById('transactionRecurring').value = transaction.recurring;
    var editModal = new bootstrap.Modal(document.getElementById('editTransactionModal'));
    editModal.show();
    document.getElementById('saveTransactionChanges').addEventListener('click', () => {
        saveTransactionChanges(transactionId);
        editModal.hide();
    });
}

function saveTransactionChanges(transactionId) {
    const transactionIndex = userData.transactionHistory.findIndex(transaction => transaction.id === parseInt(transactionId));
    if (transactionIndex !== -1) {
        const currentTransaction = userData.transactionHistory[transactionIndex];

        const updatedTransaction = {
            id: parseInt(transactionId),
            date: document.getElementById('transactionDate').value,
            vendor: document.getElementById('transactionVendor').value,
            amount: parseFloat(document.getElementById('transactionAmount').value),
            category: document.getElementById('transactionCategory').value,
            description: document.getElementById('transactionDescription').value,
            type: document.getElementById("transactionType").value,
            recurring: document.getElementById('transactionRecurring').value
        };
        userData.transactionHistory[transactionIndex] = updatedTransaction;
        
            updateJSONBlob(userData, function(success) {
                if (success) {
                    alert("Transaction updated successfully");
                } else {
                    alert("Failed to update the transaction.");
                }
            });
       
    }
}

function deleteTransaction(transactionId, data) {
    if (confirm("Are you sure you want to delete the transaction? It cannot be undone.")) {
        const updatedTransactions = data.transactionHistory.filter(transaction => transaction.id !== parseInt(transactionId));
        userData.transactionHistory = updatedTransactions;
        updateJSONBlob(userData, function() {
            window.location.href = "/";
        });
    }
}


document.addEventListener('DOMContentLoaded', function() {
    displayPageData();
});


