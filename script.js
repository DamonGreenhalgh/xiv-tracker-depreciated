const characterNameTextbox = document.getElementById('character-name-textbox');
const searchBtn = document.getElementById('search-button');
const searchResultLst = document.getElementById('search-results-list');

let searchResults;

// Listener on click event for the sumbit button.
searchBtn.addEventListener('click', function() {
    searchResultLst.innerText = "";
    requestCharacterSearch(characterNameTextbox.value);
});

// Listener for textbox on 'Enter' key press to sumbit id.
characterNameTextbox.addEventListener('keyup', function(event) {
    if (event.key == "Enter") {
        searchBtn.click();
    }
});


// Fetch character data from FFXIVAPI
async function requestCharacterSearch(name) {

    response = await fetch("https://xivapi.com/character/search?name=" + name, {mode: 'cors'});
    searchResults = (await response.json()).Results;
    
    // Create and display response character banners.
    for (let i = 0; i < searchResults.length; i++) {
        createCharacterBanner(searchResults[i]);
    }

}

// Creates character banners as search results.
function createCharacterBanner(character) {

    const characterBanner = document.createElement("div");
    const avatar = document.createElement("img");
    const name = document.createTextNode(character.Name);

    // Listener for when user clicks on a character banner.
    characterBanner.addEventListener('click', function() {
        CharacterData = character;
        window.location.href = "character.html?id=" + character.ID;
    }); 

    // Link to classes for styling.
    characterBanner.setAttribute('class', "character-banner-container");
    avatar.setAttribute('src', character.Avatar);
    avatar.setAttribute('class', "character-banner-avatar");
    avatar.setAttribute('style', "border-radius: 100%;");


    // Append banner components to banner, and banner to list.
    characterBanner.append(avatar);
    characterBanner.append(name);
    searchResultLst.append(characterBanner);
}
