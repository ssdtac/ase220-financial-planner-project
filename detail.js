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
        const transaction = userData.transactionHistory.find(transaction => transaction.id === id);
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
        if (userData) {

            const transactionDetails = findTransactionById(transactionId);
            displayTransactionDetails(transactionDetails);
            setupEditAndDeleteButtons(transactionDetails, userData, transactionId);
        }});
    } else {
        document.getElementById('transaction-details').innerText = 'Transaction ID not provided in the URL.';
    }
}


function setupEditAndDeleteButtons(transaction, data, transactionId) {
    document.getElementById('edit-transaction').addEventListener('click', () => showEditModal(transaction, data, transactionId));
    document.getElementById('delete-transaction').addEventListener('click', () => deleteTransaction(transactionId, data));
}

function showEditModal(transaction, data, transactionId) {
    document.getElementById('transactionDate').value = transaction.date;
    document.getElementById('transactionVendor').value = transaction.vendor;
    document.getElementById('transactionAmount').value = transaction.amount;
    document.getElementById('transactionCategory').value = transaction.category;
    document.getElementById('transactionDescription').value = transaction.description;
    var editModal = new bootstrap.Modal(document.getElementById('editTransactionModal'));
    editModal.show();
    document.getElementById('saveTransactionChanges').onclick = () => {
        saveTransactionChanges(transactionId, data);
        editModal.hide();
    };
}

function saveTransactionChanges(transactionId) {
    const transactionIndex = userData.transactionHistory.findIndex(transaction => transaction.id === transactionId);
    if (transactionIndex !== -1) {
        const currentTransaction = userData.transactionHistory[transactionIndex];

        const updatedTransaction = {
            id: transactionId,
            date: document.getElementById('transactionDate').value,
            vendor: document.getElementById('transactionVendor').value,
            amount: parseFloat(document.getElementById('transactionAmount').value),
            category: document.getElementById('transactionCategory').value,
            description: document.getElementById('transactionDescription').value,
            type: currentTransaction.type,
            recurring: currentTransaction.recurring
        };

        getUserData(localStorage.blobId).then(function() {
            userData.transactionHistory[transactionIndex] = updatedTransaction;

            updateJSONBlob(userData, function(success) {
                if (success) {
                    alert("Transaction updated successfully");
                    location.reload(); 
                } else {
                    alert("Failed to update the transaction.");
                }
            });
        });
    }
}

function deleteTransaction(transactionId, data) {
    data.transactionHistory = data.transactionHistory.filter(transaction => transaction.id !== transactionId);
    updateJSONBlob(data, () => {
        alert("Transaction deleted successfully");
        window.location.href = "index.html";
    });
}

// Update JSONBlob
function updateJSONBlob(data) {
    const dataLocation = `https://jsonblob.com/api/jsonBlob/${localStorage.blobId}`;
    
    fetch(dataLocation, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(updatedData => {
        console.log('JSONBlob updated successfully', updatedData);
        alert('Transaction updated successfully');
    })
    .catch(error => console.error('Error updating JSONBlob:', error));
}

