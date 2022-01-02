async function main() {

    // Get character id from url parameter.
    const searchParams = new URLSearchParams(window.location.search);
    const characterId = searchParams.get('id');
    const characterName = searchParams.get('name');

    document.title = characterName + " | XIV Tracker";

    // Request character data from XIVAPI.
    let characterData = (await requestData("character/" + characterId)).Character;

    console.log(characterData);

    const jobAbreviation = (await requestData("ClassJob/" + characterData.ActiveClassJob.ClassID)).Abbreviation
    
    // Display data to the user.
    document.getElementById('character-name').innerHTML = characterData.Name;
    document.getElementById('server-name').innerHTML = characterData.Server;
    document.getElementById('character-avater').setAttribute('src', characterData.Avatar);
    document.getElementById('character-portrait').style.backgroundImage = "url('" + characterData.Portrait + "')";

    // Load title
    let titleData = (await requestData("title/" + characterData.Title));

    // Determine if the title is a prefix or suffix, then display on character banner.
    if (titleData.IsPrefix) {
        document.getElementById('prefix-name').innerHTML = titleData.Name;
    } else {
        document.getElementById('suffix-name').innerHTML = titleData.Name;
    }

    // Load job icon
    let jobData = await requestData("ClassJob/" + characterData.ActiveClassJob.JobID);
    document.getElementById('active-job-icon').setAttribute('src', "https://xivapi.com/cj/svg/ClassJob/" + jobData.Abbreviation + ".svg");

    // Populate job stats container.
    const jobStats = document.getElementById('job-stats');
    const jobs = characterData.ClassJobs;

    for(let i = 0; i < jobs.length; i++) {
        const index = (jobs[i].Name).indexOf("/");
        const jobName = ((jobs[i].Name).slice(index+1)).replace(/ /g, "");

        const jobDiv = document.createElement("div");
        const jobIcon = document.createElement("img");
        const jobLbl = document.createElement("p");

        jobDiv.setAttribute('class', "utility-flex-class");
        jobIcon.setAttribute('src', "https://xivapi.com/cj/1/" + jobName + ".png");
        jobIcon.setAttribute('class', "job-icon");
        jobLbl.setAttribute('class', "job-label");

        jobLbl.innerHTML = jobs[i].Level;

        // If job is max level, change color to indicate the status.
        if (jobLbl.innerHTML == "90") {
            jobLbl.style.color = "var(--job-max-level-color)"
        } else if (jobLbl.innerHTML == "0") {
            jobLbl.innerHTML = "-";
            jobLbl.style.color = "var(--secondary-text-color)"
        }

        jobDiv.append(jobIcon);
        jobDiv.append(jobLbl);
        jobStats.append(jobDiv);

        let row;
        // Formatting for jobs.
        switch (true) {
            case (i < 8): row = "1"; break;
            case (i < 16): row = "2"; break;
            case (i < 20): row = "3"; break;
            case (i < 28): row = "4"; break;
            default: row = "5";
        }

        jobDiv.style.gridRowStart = row;
    }

    // Load currently equiped items.
    const mainHandURL = "url('https://xivapi.com" + (await requestData("Item/" + characterData.GearSet.Gear.MainHand.ID)).IconHD + "')";
    const headURL = "url('https://xivapi.com" + (await requestData("Item/" + characterData.GearSet.Gear.Head.ID)).IconHD + "')";
    const handsURL = "url('https://xivapi.com" + (await requestData("Item/" + characterData.GearSet.Gear.Hands.ID)).IconHD + "')";
    const bodyURL = "url('https://xivapi.com" + (await requestData("Item/" + characterData.GearSet.Gear.Body.ID)).IconHD + "')";
    const legsURL = "url('https://xivapi.com" + (await requestData("Item/" + characterData.GearSet.Gear.Legs.ID)).IconHD + "')";
    const feetURL = "url('https://xivapi.com" + (await requestData("Item/" + characterData.GearSet.Gear.Feet.ID)).IconHD + "')";
    const earingsURL = "url('https://xivapi.com" + (await requestData("Item/" + characterData.GearSet.Gear.Earrings.ID)).IconHD + "')";
    const necklaceURL = "url('https://xivapi.com" + (await requestData("Item/" + characterData.GearSet.Gear.Necklace.ID)).IconHD + "')";
    const braceletsURL = "url('https://xivapi.com" + (await requestData("Item/" + characterData.GearSet.Gear.Bracelets.ID)).IconHD + "')";
    const ring1URL = "url('https://xivapi.com" + (await requestData("Item/" + characterData.GearSet.Gear.Ring1.ID)).IconHD + "')";
    const ring2URL = "url('https://xivapi.com" + (await requestData("Item/" + characterData.GearSet.Gear.Ring2.ID)).IconHD + "')";
    const soulCrystalURL = "url('https://xivapi.com" + (await requestData("Item/" + characterData.GearSet.Gear.SoulCrystal.ID)).IconHD + "')";

    document.getElementById('MainHand').style.backgroundImage = mainHandURL;
    document.getElementById('Head').style.backgroundImage = headURL;
    document.getElementById('Hands').style.backgroundImage = handsURL;
    document.getElementById('Body').style.backgroundImage = bodyURL;
    document.getElementById('Legs').style.backgroundImage = legsURL;
    document.getElementById('Feet').style.backgroundImage = feetURL;
    document.getElementById('Earings').style.backgroundImage = earingsURL;
    document.getElementById('Necklace').style.backgroundImage = necklaceURL;
    document.getElementById('Bracelets').style.backgroundImage = braceletsURL;
    document.getElementById('Ring1').style.backgroundImage = ring1URL;
    document.getElementById('Ring2').style.backgroundImage = ring2URL;
    document.getElementById('SoulCrystal').style.backgroundImage = soulCrystalURL;

    // Main Scenario Quest Timeline
    // This array holds the achievement id of the following expansion completion achievements.
    // A Realm Reborn, Heavensward, Stormblood, Shadowbringers, Endwalker.
    const achievementReference = [788, 1139, 1794, 2298, 2958];
}




// Function to make requests to XIVAPI
async function requestData(content) {
    let response = await fetch("https://xivapi.com/" + content, {mode: 'cors'});
    let data = await response.json();

    return data;
}

main();