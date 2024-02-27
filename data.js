const dataLocation = "https:///jsonblob.com/api/jsonBlob/jsonblob.com/1212135446795902976"
const itemsPerPage = 9


async function loadIndex() {
    try {
        const response = await fetch(dataLocation);
        data = await response.json();
        displayIndexData(0, itemsPerPage, false);
    } catch (error) {
        console.error('Failed to load data!', error);
    }
}

function displayIndexData() {
    // until more work is done, i'm sticking to a single user
    userData = data["cassiancc"]
    console.log()
    document.getElementById("title-div").innerHTML += `<h2>${userData.username}</h2>`
}