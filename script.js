const characterIdTextbox = document.getElementById('character-id-textbox');
const submitBtn = document.getElementById('submit-button');
let characterJson;

// Listener on click event for the sumbit button.
submitBtn.addEventListener('click', function() {
    requestData(characterIdTextbox.value);
    characterIdTextbox.value = ""; // Clear textbox
});

// Listener for textbox on 'Enter' key press to sumbit id.
characterIdTextbox.addEventListener('keyup', function(event) {
    if (event.key == "Enter") {
        submitBtn.click();
    }
});

// Fetch character data from FFXIVAPI
async function requestData(characterId) {
    console.log("Requesting data from XIVAPI...");

    response = await fetch("https://xivapi.com/character/" + characterId, {mode: 'cors'});
    characterJson = await response.json();

    const statusLbl = document.getElementById('status-label');
    if (response.ok) {
        statusLbl.textContent = "Data retrieved!";
        console.log("Data retrieved!")

        const container = document.getElementById('container');

        container.setAttribute("src", characterJson.Character.Portrait);
    } else {
        statusLbl.textContent = "Character does not exist, or an unexpected error has occured.";
        console.log("Character does not exist, or an unexpected error has occured.");
    }
}
