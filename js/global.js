var userShown = false;
var userData;


async function loginUser(username, password) {
    console.log(username, password)
    let response = await fetch("/api/findid/"+username+"/"+password);
        data = await response.json();
        console.log(data)
    if(!userShown){
        if (response.ok) {  
            userShown = true;
            localStorage.blobId = data._id;
            location.href = `http://localhost:5500/dashboard?user=${data._id}`
        } else {
            localStorage.username = ""
            alert("Username does not exist!")
        }
        changeDisplays(userShown, data.username);
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
