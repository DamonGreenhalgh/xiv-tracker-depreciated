async function main() {

    // Get character id and name from url parameter.
    const searchParams = new URLSearchParams(window.location.search);
    const characterId = searchParams.get('id');
    const characterName = searchParams.get('name');

    document.title = characterName + " | XIV Tracker";



    const tabButtons = document.getElementsByClassName('tab-button');
    const tabID = ['profile', 'job', 'collection', 'stats'];

    // Add action listeners to each tab button so users can switch between content.
    for (let i = 0; i < tabButtons.length; i++) {

        const currentTabButton = tabButtons[i];
        currentTabButton.addEventListener('click', function() {

            // Disable other tab buttons and hide current content.
            for (let i = 0; i < tabButtons.length; i++) {

                // Style change to indicate hidden content/
                tabButtons[i].style.backgroundColor = "var(--midground-color)";
                tabButtons[i].style.color = "var(--text-background-color)";
                tabButtons[i].style.boxShadow = "";

                // Hide current content.
                document.getElementById(tabID[i]).style.visibility = "hidden";
            }

            // Style change to indicate button is selected.
            tabButtons[i].style.backgroundColor = "var(--accent-color)";
            tabButtons[i].style.color = "var(--contrast-color)";
            tabButtons[i].style.boxShadow = "0 1rem 2rem var(--shadow-color)";

            // Make associated content visibile
            document.getElementById(tabID[i]).style.visibility = "visible";
        })
    }

    // Default tab on window open.
    tabButtons[0].click();



    // General Character Information
    // -----------------------------

    // Request character data from XIVAPI.
    let characterData = (await requestData("character/" + characterId)).Character;

    const jobAbreviation = (await requestData("ClassJob/" + characterData.ActiveClassJob.ClassID)).Abbreviation
    
    // Display data to the user.
    document.getElementById('character-name').innerText = characterName;
    document.getElementById('server-name').innerText = characterData.Server + " - " + characterData.DC;
    document.getElementById('character-avater').setAttribute('src', characterData.Avatar);
    document.getElementById('character-portrait').style.backgroundImage = "url('" + characterData.Portrait + "')";
    document.getElementById('active-job-level').innerText = "Lv. " + characterData.ActiveClassJob.Level;

    // Load title
    let titleData = (await requestData("title/" + characterData.Title));

    // Determine if the title is a prefix or suffix, then display on character banner.
    if (titleData.IsPrefix) {
        document.getElementById('prefix-name').innerHTML = titleData.Name;
    } else {
        document.getElementById('suffix-name').innerHTML = titleData.Name;
    }

    
    
    // Profile Panel Information
    // ------------------------

    // Profile data, will be stored in JSON eventually.
    const grandCompanyTypes = ["Maelstrom", "Order of the Twin Adder", "Immortal Flames"];
    const genderTypes = ["Male", "Female"];
    const raceTypes = ["Hyur", "Elezen", "Lalafell", "Miqo'te", "Roegadyn", "Au Ra", "Hrothgar", "Viera"];
    const tribeTypes = ["Midlander", "Highlander", "Wildwood", "Duskwight", "Plainsfolk", "Dunesfolk", "Seeker of the Sun", "Keeper of the Moon", "Sea Wolf", "Hellsguard", "Raen", "Xaela", "Helions", "The Lost", "Rava", "Veena"];
    const cityStateTypes = ["Limsa Lominsa", "Gridania", "Ul'dah"];

    document.getElementById('race-clan-gender').innerText = raceTypes[characterData.Race-1] + " " + tribeTypes[characterData.Tribe-1] + " " + genderTypes[characterData.Gender-1];
    document.getElementById('city-state').innerText = cityStateTypes[characterData.Town-1];
    document.getElementById('name-day').innerText = characterData.Nameday;

    // Load Free Company Information
    if (characterData.FreeCompanyName) {

        document.getElementById('free-company-name').innerText = characterData.FreeCompanyName;

        const freeCompanyData = await requestData("FreeCompany/" + characterData.FreeCompanyId);

        document.getElementById('free-company-crest-1').style.backgroundImage = "url('" + freeCompanyData.FreeCompany.Crest[0] + "')";
        document.getElementById('free-company-crest-2').style.backgroundImage = "url('" + freeCompanyData.FreeCompany.Crest[1] + "')";
        document.getElementById('free-company-crest-3').style.backgroundImage = "url('" + freeCompanyData.FreeCompany.Crest[2] + "')";

    } else {
        console.log("Character is not associated with any Free Company!");
    }
    
    // Load Grand Company Information
    if (characterData.GrandCompany) {

        document.getElementById('grand-company-name').innerText = grandCompanyTypes[characterData.GrandCompany.NameID-1];
        document.getElementById('grand-company-icon').style.backgroundImage = "url('https://xivapi.com/img-misc/gc/character_gc_" + characterData.GrandCompany.NameID + "_" + characterData.GrandCompany.RankID + ".png')";

    } else {
        console.log("Character is not associated with any Grand Company!");
    }

    // Guardian Deity Data
    let guardianData = await requestData("GuardianDeity/" + characterData.GuardianDeity);
    document.getElementById('guardian-icon').style.backgroundImage = "url('https://xivapi.com" + guardianData.IconHD + "')";
    document.getElementById('guardian-name').innerText = guardianData.Name;



    // Character Equipment Information
    // -------------------------------
    
    // Load equiment.
    const itemType = ["MainHand", "Head", "Hands", "Body", "Legs", "Feet", "Earrings", "Necklace", "Bracelets", "Ring1", "Ring2", "SoulCrystal", "OffHand"];
    for (let i = 0; i < itemType.length; i++) {

        try {
            const imageSource = "url('https://xivapi.com" + (await requestData("Item/" + characterData.GearSet.Gear[itemType[i]].ID)).IconHD + "')";
            document.getElementById(itemType[i]).style.backgroundImage = imageSource;
        } catch(error) {
            console.log(itemType[i] + " does not exist.");
        }
        
    }



    // Jobs Panel Information
    // ----------------------

    // Load job icon
    let jobData = await requestData("ClassJob/" + characterData.ActiveClassJob.JobID);
    document.getElementById('active-job-icon').setAttribute('src', "https://xivapi.com/cj/svg/ClassJob/" + jobData.Abbreviation + ".svg");

    // Populate job stats container.
    const jobStats = document.getElementById('job');
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
            jobLbl.style.color = "var(--text-midground-color)"
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
            case (i < 28): row = "5"; break;
            default: row = "6";
        }

        jobDiv.style.gridRowStart = row;
    }



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