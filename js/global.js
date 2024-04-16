var userShown = false;
var userData;

async function getUserData(blobId) {
    try {
        let response = await fetch("/api/users/"+blobId);
        userData = await response.json();
    } catch (error) {
        console.error('Failed to load user data!', error);
    }
}

async function loginUser(username) {
    try {
        let response = await fetch("/login", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                username, 
                password: document.getElementById("password").value
            })
        })
        console.log(response)
    } catch (error) {
        console.error("Login failed!", error)
    }
}

function logoutUser() {
    if(userShown) {
        localStorage.username = ""
        userShown = false;
    }
    changeDisplays(userShown, "");
}



const dataLocation = "/api/users.json"
var users;


async function loadPage() {
    try {
        const response = await fetch(dataLocation);
        users = await response.json();
    } catch (error) {
        console.error('Failed to load data!', error);
    }
}

// Update JSONBlob
async function updateJSONBlob(data) {
    const dataLocation = `/api/users/${localStorage.blobId}`;

    try {
        const response = await fetch(dataLocation, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const updatedData = await response.json();
            console.log('JSONBlob updated successfully', updatedData);
            alert('Transaction updated successfully');
            location.reload();
            return true;
        } else {
            throw new Error('Failed to update JSONBlob');
        }
    } catch (error) {
        console.error('Error updating JSONBlob:', error);
        alert('Failed to update the transaction.');
        return false;
    }
}

function readDate() {
    date = userData.transactionHistory[selectedTimeframe].date.split("-")
    date = new Date(date[0], date[1], date[2])
    return date
}


loadPage()