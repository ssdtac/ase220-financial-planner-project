var data;
var users;

async function getUsers() {
    console.log("unfinished")
}

async function setUsers() {
    const response = await fetch('/api/users.json', {
        method: "PUT", 
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(users)
    });

    if (response.ok) {
        alert("User created successfully.");
    } else {
        
    }
}




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

// Could be moved to somewhere else when button is added
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

});


