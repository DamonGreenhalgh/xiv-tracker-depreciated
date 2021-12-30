async function main() {

    // Get character id from url parameter.
    const characterId = (new URLSearchParams(window.location.search)).get('id');

    // Request character JSON from XIVAPI.
    let response = await fetch("https://xivapi.com/character/" + characterId, {mode: 'cors'});
    let characterData = (await response.json()).Character;

    document.title = "FFXIV Tracker - " + characterData.Name;
    
    // Display data to the user.
    document.getElementById('character-name').innerHTML = characterData.Name;
    document.getElementById('server-name').innerHTML = characterData.Server;
    document.getElementById('job-name').innerHTML = characterData.ActiveClassJob.UnlockedState.Name;
    document.getElementById('character-portrait').setAttribute('src', characterData.Portrait);
    document.getElementById('character-avater').setAttribute('src', characterData.Avatar);
    document.getElementById('level').innerHTML = characterData.ActiveClassJob.Level;

    // Display level experience.
    let ratio = (characterData.ActiveClassJob.ExpLevel / characterData.ActiveClassJob.ExpLevelMax)*100;
    document.getElementById('level-experience').style.width = ratio.toString() + "%";

    // Retrieve title information.
    response = await fetch("https://xivapi.com/title/" + characterData.Title, {mode: 'cors'});
    let titleData = await response.json();

    // Display title, determine if prefix or suffix.
    if (titleData.IsPrefix) {
        document.getElementById('prefix-name').innerHTML = titleData.Name + " ...";
    } else {
        document.getElementById('suffix-name').innerHTML = "... " + titleData.Name;
    }

    
    // Retrieve job icon.
    response = await fetch("https://xivapi.com/ClassJob/" + characterData.ActiveClassJob.JobID, {mode: 'cors'});
    let jobData = await response.json();

    document.getElementById('job-icon').setAttribute('src', "https://xivapi.com" + jobData.Icon);

}

main();