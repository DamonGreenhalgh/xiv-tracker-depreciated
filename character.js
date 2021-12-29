
async function main() {

    // Get character id from url parameter.
    const characterId = (new URLSearchParams(window.location.search)).get('id');

    // Request character JSON from XIVAPI.
    let response = await fetch("https://xivapi.com/character/" + characterId, {mode: 'cors'});
    let characterData = (await response.json()).Character;

    console.log(characterData);

    document.title = "FFXIV Tracker - " + characterData.Name;
    
    // Display data to the user.
    const characterPortrait = document.getElementById('character-portrait');
    const characterAvater = document.getElementById('character-avater');
    
    document.getElementById('character-name').innerHTML = characterData.Name;
    document.getElementById('server-name').innerHTML = characterData.Server;
    document.getElementById('job-name').innerHTML = characterData.ActiveClassJob.UnlockedState.Name;

    characterPortrait.setAttribute('src', characterData.Portrait);
    characterAvater.setAttribute('src', characterData.Avatar);

    // Retrieve title information.
    response = await fetch("https://xivapi.com/title/" + characterData.Title, {mode: 'cors'});
    let titleData = await response.json();

    console.log(titleData);

    // Display title, determine if prefix or suffix.
    let titleType;
    if (titleData.IsPrefix) {
        titleType = 'prefix';
    } else {
        titleType = 'suffix';
    }

    document.getElementById(titleType + '-name').innerHTML = titleData.Name;
    
    // Retrieve job information.
    response = await fetch("https://xivapi.com/ClassJob/" + characterData.ActiveClassJob.JobID, {mode: 'cors'});
    let jobData = await response.json();

    document.getElementById('job-icon').setAttribute('src', "https://xivapi.com" + jobData.Icon);

}

main();