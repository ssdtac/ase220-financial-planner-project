$(document).on("click", "#logout-button", function() {
    logoutUser();
    location.reload();
});

async function getUsers() {
    try {
        const response = await fetch('/api/users.json');
        users = await response.json();
    } catch (error) {
        console.error('Failed to load data!', error);
    }
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

document.querySelector("#transactionCategory").addEventListener("click", function() {
    let val = document.querySelector("#transactionCategory").value;
    if(val == "purchase") {
        // do purchase things
    } else if (val == "deposit") {
        //do deposit things
    }
});

$(document).on("change", "#transactionType", function() {
    if (document.getElementById("transactionType").value == "deposit") {
        document.getElementById("transactionCategory").selectedIndex = 2
    }
    else {
        document.getElementById("transactionCategory").selectedIndex = 0
    }
});

