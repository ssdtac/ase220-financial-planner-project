function displayTransactionDetails(transaction) {
    if (transaction) {
        document.getElementById('transaction-details').innerHTML = `
            <p>Date: ${transaction.date}</p>
            <p>Vendor: ${transaction.vendor}</p>
            <p>Amount: $${transaction.amount}</p>
            <p>Category: ${transaction.category}</p>
            <p>Description: ${transaction.description}</p>
        `;
    } else {
        document.getElementById('transaction-details').innerText = 'Transaction details not found.';
    }
}

function findTransactionById(id) {
        const transaction = userData.transactionHistory.find(transaction => transaction.id === parseInt(id));
        if (transaction) {
            return transaction;
        }
    return null;
}

async function displayPageData() {
    const urlParams = new URLSearchParams(window.location.search);
    const transactionId = urlParams.get('id');
    if (transactionId) {
        getUserData(localStorage.blobId).then( function() {
            const transactionDetails = findTransactionById(transactionId);
            displayTransactionDetails(transactionDetails);
            setupEditAndDeleteButtons(transactionDetails, userData, transactionId);
        });
    } else {
        document.getElementById('transaction-details').innerText = 'Transaction ID not provided in the URL.';
    }
}


function setupEditAndDeleteButtons(transaction, data, transactionId) {
    document.getElementById('edit-transaction').addEventListener('click', () => showEditModal(transaction, transactionId));
    document.getElementById('delete-transaction').addEventListener('click', () => deleteTransaction(transactionId, data));
}

function showEditModal(transaction, transactionId) {
    document.getElementById('transactionDate').value = transaction.date;
    document.getElementById('transactionVendor').value = transaction.vendor;
    document.getElementById('transactionAmount').value = transaction.amount;
    document.getElementById('transactionCategory').value = transaction.category;
    document.getElementById('transactionDescription').value = transaction.description;
    document.getElementById('transactionType').value = transaction.type;
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
            recurring: currentTransaction.recurring
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
    if(confirm("Are you sure you want to delete the transaction? It cannot be undone.")) {
        data.transactionHistory = data.transactionHistory.filter(transaction => transaction.id !== transactionId);
        updateJSONBlob(data, () => {
            alert("Transaction deleted successfully");
            window.location.href = "index.html";
        }); 
    }   
}



