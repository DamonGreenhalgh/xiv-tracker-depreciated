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

    response = await fetch("https://xivapi.com/character/" + characterId + "?data=AC,FR,FC,FCM,MIMO,PVP", {mode: 'cors'});
    characterJson = await response.json();

    console.log("Data has been successfully recieved from XIVAPI!")
    console.log(characterJson);
}
