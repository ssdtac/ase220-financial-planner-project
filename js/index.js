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




async function createUser(username, password) {
    const newUser = {
        username: username,
        password: password,
        balance: 0,
        spendingHistory: [
            {
              timeframe: "February 2024",
              dates: [
                "2024-02-01",
                "2024-05-28"
              ],
              needs: 0.5,
              wants: 0.2,
              savings: 0.2
            },
          ],
        transactionHistory: []
    }
    const response = await fetch(`/api/users/${username}`, 
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(newUser)
    });

    console.log(response)

            
        data = await response.json();
        console.log(data)
        if (data == 400) {
            console.log("Invalid user!")
            alert("Invalid username.")
        }
        else {
            localStorage.blobId = data
            location.href = "/dashboard"
        }

}


document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("addUserButton").addEventListener("click", function() {
        $("#addUserModal").modal("show");
    });

    document.getElementById("saveNewUser").addEventListener("click", async function() {
        let newUsername = document.getElementById("newUsername").value;
        let newPassword = document.getElementById("newPassword").value;
        createUser(newUsername, newPassword).then(function() {
            $('#addUserModal').modal('hide');
        });
    });

    document.getElementById('discardUser').addEventListener("click", function() {
        document.getElementById('newUsername').value = '';
        document.getElementById('newPassword').value = '';
    });
});


