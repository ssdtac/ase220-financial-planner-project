async function fetchTransactionData() {
    const dataLocation = "https://jsonblob.com/api/jsonBlob/jsonblob.com/1212135446795902976";
    try {
        const response = await fetch(dataLocation);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to load data!', error);
        return null;
    }
}

function displayTransactionDetails(transaction) {
    if (transaction) {
        document.getElementById('transaction-details').innerHTML = `
            <p>Date: ${transaction.date}</p>
            <p>Category: ${transaction.category}</p>
            <p>Vendor: ${transaction.vendor}</p>
            <p>Amount: $${transaction.amount}</p>
            <p>Frequency: ${transaction.recurring ? 'Recurring' : 'One-Time'}</p>
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

async function loadTransactionDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const transactionId = urlParams.get('id');

    if (transactionId) {
        const data = await fetchTransactionData();
        if (data) {
            const transactionDetails = findTransactionById(data, transactionId);
            displayTransactionDetails(transactionDetails);
        }
    } else {
        document.getElementById('transaction-details').innerText = 'Transaction ID not provided in the URL.';
    }
}

// Call the function when the page loads
loadTransactionDetails();
