async function main() {

    // Get character id from url parameter.
    const searchParams = new URLSearchParams(window.location.search);
    const characterId = searchParams.get('id');
    const characterName = searchParams.get('name');

    document.title = characterName + " | XIV Tracker";

    // Request character data from XIVAPI.
    let characterData = (await requestData("character/" + characterId + "?private_key=b31232edb76f40cc9e6b71e8845f920c42db69bc4e204cefbfe75f9631046407")).Character;

    console.log(characterData);

    const jobAbreviation = (await requestData("ClassJob/" + characterData.ActiveClassJob.ClassID)).Abbreviation
    
    // Display data to the user.
    document.getElementById('character-name').innerHTML = characterData.Name;
    document.getElementById('server-name').innerHTML = characterData.Server;
    document.getElementById('character-avater').setAttribute('src', characterData.Avatar);
    document.getElementById('character-portrait').setAttribute('src', characterData.Portrait);
    document.getElementById('job-text').innerHTML = jobAbreviation + " Lv. " + characterData.ActiveClassJob.Level + " EXP " + characterData.ActiveClassJob.ExpLevel + " / " + characterData.ActiveClassJob.ExpLevelMax;

    // Request title name from XIVAPI.
    let titleData = (await requestData("title/" + characterData.Title));

    // Determine if the title is a prefix or suffix, then display on character banner.
    if (titleData.IsPrefix) {
        document.getElementById('prefix-name').innerHTML = titleData.Name;
    } else {
        document.getElementById('suffix-name').innerHTML = titleData.Name;
    }

    // Current job display section
    // Display level experience bar.
    const ratio = (characterData.ActiveClassJob.ExpLevel / characterData.ActiveClassJob.ExpLevelMax)*100;
    document.getElementById('level-experience').style.width = ratio.toString() + "%";

    // Request job icon from XIVAPI.
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