
async function main() {

    // Get character id from url parameter.
    const characterId = (new URLSearchParams(window.location.search)).get('id');

    // Request character JSON from XIVAPI.
    let response = await fetch("https://xivapi.com/character/" + characterId + "?data=MIMO", {mode: 'cors'});
    let characterData = (await response.json()).Character;

    console.log(characterData);

    // Display data to the user.
    const characterPortrait = document.getElementById('character-portrait');
    const characterAvater = document.getElementById('character-avater');
    characterPortrait.setAttribute('src', characterData.Portrait);
    characterAvater.setAttribute('src', characterData.Avatar);
}

main();