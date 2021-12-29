// Load server choices.
populateServerList();

async function populateServerList() {

    let response = await fetch("https://xivapi.com/Servers", {mode: 'cors'});
    let data = await response.json();

    const serverList = document.getElementById('server-list');

    for (let i = 0; i < data.length; i++) {
        const server = document.createElement("option");
        server.innerHTML = data[i];
        serverList.append(server);
    }
}

const characterNameTextbox = document.getElementById('character-name-textbox');
const serverList = document.getElementById('server-list');
const searchBtn = document.getElementById('search-button');
const searchResultLst = document.getElementById('search-results-list');

let searchResults;

// Listener on click event for the sumbit button.
searchBtn.addEventListener('click', function() {
    searchResultLst.innerText = "";
    requestCharacterSearch(characterNameTextbox.value, serverList.value);
});

// Listener for textbox on 'Enter' key press to sumbit id.
characterNameTextbox.addEventListener('keyup', function(event) {
    if (event.key == "Enter") {
        searchBtn.click();
    }
});

// Fetch character data from FFXIVAPI
async function requestCharacterSearch(name, server) {

    response = await fetch("https://xivapi.com/character/search?name=" + name + "&server=" + server, {mode: 'cors'});
    searchResults = (await response.json()).Results;


    console.log("https://xivapi.com/character/search?name=" + name + "&server=" + server)
    console.log(searchResults);
    
    // Create and display response character banners.
    for (let i = 0; i < searchResults.length; i++) {
        createCharacterBanner(searchResults[i]);
    }
}

// Creates character banners as search results.
function createCharacterBanner(character) {

    const characterBanner = document.createElement("div");
    const avatar = document.createElement("img");
    const name = document.createElement("div");
    const server = document.createElement("div");
    const link = document.createElement("a");

    // Listener for when user clicks on a character banner.
    // characterBanner.addEventListener('click', function() {
    //     window.location.href = "character.html?id=" + character.ID;
    // }); 


    name.innerText = character.Name;
    server.innerText = character.Server;

    link.href = "character.html?id=" + character.ID;

    // Link to classes for styling.
    characterBanner.setAttribute('class', "character-banner-container");
    avatar.src = character.Avatar;
    avatar.style.borderRadius = "100%";


    // Append banner components to banner, and banner to list.
    characterBanner.append(avatar);
    characterBanner.append(name);
    characterBanner.append(server);
    link.append(characterBanner);
    searchResultLst.append(link);
}
