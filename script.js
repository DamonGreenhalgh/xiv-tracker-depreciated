
// Elements
const characterNameTextbox = document.getElementById('character-name-textbox');
const serverList = document.getElementById('server-list');
const searchBtn = document.getElementById('search-button');
const searchResultLst = document.getElementById('search-results-list');
const searchStatusLbl = document.getElementById('search-status');
const loadingIcon = document.getElementById('loading-icon');
let searchResults;

// Character page linking, if there are search parameters, search using those parameters.
const searchParams = new URLSearchParams(window.location.search);
const characterName = searchParams.get('name');
const serverName = searchParams.get('server');

if (characterName !== "" && characterName !== null) {
    characterNameTextbox.value = characterName;
    serverList.value = serverName;
    requestCharacterSearch(characterName, serverName);
}


// Listener for search button on 'click'.
searchBtn.addEventListener('click', function() {
    requestCharacterSearch(characterNameTextbox.value, serverList.value);
});

// Listener for textbox on 'Enter' key press.
characterNameTextbox.addEventListener('keyup', function(event) {
    if (event.key == "Enter") {
        searchBtn.click();
    }
});

characterNameTextbox.focus();


// Fetch character data from FFXIVAPI
async function requestCharacterSearch(name, server) {

    // Clear previous results, and status label.
    searchResultLst.innerText = "";
    searchStatusLbl.innerText= "";

    // Display loading icon.
    loadingIcon.style.display = "flex";

    // If no server selected, set to empty string
    server = server == "Server" ? "" : server;

    // Request character search from xivapi.com
    await fetch("https://xivapi.com/character/search?name=" + name + "&server=" + server, {mode: 'cors'})
        .then(response => response.json())
        .then(data => searchResults = data.Results);

    // Hide loading icon.
    loadingIcon.style.display = "none";

    // If we don't get any results, return an error message.
    if (searchResults.length == 0) {
        searchStatusLbl.innerText = "Sorry, no characters by the name of '" + name + "'.";

    } else {

        // Otherwise, display results as character banners
        for (let i = 0; i < searchResults.length; i++) {
            createCharacterBanner(searchResults[i]);
        }

        // Help text, for if the user did not find the item that they were looking for.
        searchStatusLbl.innerText = "Didn't find what you were looking for? Try searching with full character name and server!";
    }
}

// Function to create a character banner
function createCharacterBanner(character) {

    const characterBanner = document.createElement("div");
    const avatar = document.createElement("img");
    const textDiv = document.createElement("div")
    const name = document.createElement("h1");
    const server = document.createElement("p");
    const link = document.createElement("a");

    name.innerText = character.Name;
    server.innerText = character.Server;

    server.setAttribute('class', "secondary-text");

    link.href = "character.html?id=" + character.ID + "&name=" + character.Name;

    // Link to classes for styling.
    characterBanner.setAttribute('class', "character-banner-container");
    textDiv.setAttribute('class', "character-banner-text-container");
    avatar.src = character.Avatar;
    avatar.style.borderRadius = "100%";


    // Append banner components to banner, and banner to list.
    characterBanner.append(avatar);
    textDiv.append(name);
    textDiv.append(server);
    characterBanner.append(textDiv);
    link.append(characterBanner);
    searchResultLst.append(link);
}