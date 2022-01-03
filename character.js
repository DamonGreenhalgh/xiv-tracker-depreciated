async function main() {

    // Get character id from url parameter.
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
                tabButtons[i].style.backgroundColor = "var(--foreground-color)";
                tabButtons[i].style.color = "var(--text-midground-color)";
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
    tabButtons[1].click();

    // Request character data from XIVAPI.
    let characterData = (await requestData("character/" + characterId)).Character;

    console.log(characterData);

    const jobAbreviation = (await requestData("ClassJob/" + characterData.ActiveClassJob.ClassID)).Abbreviation
    
    // Display data to the user.
    document.getElementById('character-name').innerHTML = characterName;
    document.getElementById('server-name').innerHTML = characterData.Server;
    document.getElementById('character-avater').setAttribute('src', characterData.Avatar);
    document.getElementById('character-portrait').style.backgroundImage = "url('" + characterData.Portrait + "')";
    document.getElementById('active-job-level').innerHTML = "Lv. " + characterData.ActiveClassJob.Level;

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