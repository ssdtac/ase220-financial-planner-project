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

function findTransactionById(data, id) {
    for (const user in data) {
        const userData = data[user];
        const transaction = userData.transactionHistory.find(transaction => transaction.id === id);
        if (transaction) {
            return transaction;
        }
    }
    return null;
}

async function displayPageData() {
    const urlParams = new URLSearchParams(window.location.search);
    const transactionId = urlParams.get('id');

    if (transactionId) {
        if (data) {
            const transactionDetails = findTransactionById(data, transactionId);
            displayTransactionDetails(transactionDetails);
            setupEditAndDeleteButtons(transactionDetails, data, transactionId);
        }
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

function saveTransactionChanges(transactionId, data) {
    const updatedTransaction = {
        date: document.getElementById('transactionDate').value,
        vendor: document.getElementById('transactionVendor').value, 
        amount: parseFloat(document.getElementById('transactionAmount').value), 
        category: document.getElementById('transactionCategory').value, 
        description: document.getElementById('transactionDescription').value, 
    };
    const userData = data[Object.keys(data)[0]]; 
    const transactionIndex = userData.transactionHistory.findIndex(transaction => transaction.id === transactionId);
    if (transactionIndex !== -1) {
        userData.transactionHistory[transactionIndex] = {...userData.transactionHistory[transactionIndex], ...updatedTransaction};
        updateJSONBlob(data);
        location.reload()

    }
}

function deleteTransaction(transactionId, data) {
    if (confirm('Are you sure you want to delete this transaction?')) {
        const userData = data[Object.keys(data)[0]]; 
        const newTransactionHistory = userData.transactionHistory.filter(transaction => transaction.id !== transactionId);
        userData.transactionHistory = newTransactionHistory;
        updateJSONBlob(data);
        location.href = "/"
    }
}


// Update JSONBlob
function updateJSONBlob(data) {
    const dataLocation = 'https://jsonblob.com/api/jsonBlob/jsonblob.com/1212135446795902976';
    
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

