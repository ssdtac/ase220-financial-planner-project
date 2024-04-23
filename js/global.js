var userShown = false;
var userData;


async function loginUser(username, password) {
    try {
        let response = await fetch("/login", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                username, 
                password
            })
        })
        data = await response.json();
        if (data = 400) {
            alert("Login failed!")
        }
        else {
        }
            console.log(data._id)
            localStorage.blobId = data._id

        }
        catch (error) {
        console.error("Login failed!", error)
    }
}

async function deleteUser(id) {
    const response = await fetch(`/api/users/${id}`, 
    {
        method: 'DELETE',    
    });

    if (response.ok) {        
        console.log("Removed user")
    }
}


function logoutUser() {
    localStorage.token = "";
    localStorage.blobId = "";
    $(location).prop('href', `/`)
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
