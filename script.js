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

    serverList.value = "Cactuar";
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

    const searchStatusLbl = document.getElementById('search-status');

    searchStatusLbl.innerHTML = "";
    document.getElementById('loading-icon').style.display = "block";

    response = await fetch("https://xivapi.com/character/search?name=" + name + "&server=" + server, {mode: 'cors'});
    searchResults = (await response.json()).Results;

    document.getElementById('loading-icon').style.display = "none";

    // If we don't get any results, return an error message.
    if (searchResults.length == 0) {
        searchStatusLbl.style.color = "#d43e3e";
        searchStatusLbl.innerHTML = "Sorry, no characters by the name of '" + name + "'.";
        searchStatusLbl.style.cikir =  "#4d4f52";

    } else {

        // Otherwise, display results as character banners
        for (let i = 0; i < searchResults.length; i++) {
            createCharacterBanner(searchResults[i]);
        }

        // Help text, for if the user did not find the item that they were looking for.
        searchStatusLbl.innerHTML = "Didn't find what you were looking for? Try searching with full character name and server!";

    }
    
    

}

// Creates character banners as search results.
function createCharacterBanner(character) {

    const characterBanner = document.createElement("div");
    const avatar = document.createElement("img");
    const textDiv = document.createElement("div")
    const name = document.createElement("p");
    const server = document.createElement("p");
    const link = document.createElement("a");

    name.innerText = character.Name;
    server.innerText = character.Server;

    name.setAttribute('class', "character-name");

    link.href = "character.html?id=" + character.ID;

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
