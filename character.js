async function main() {

    // Get character id from url parameter.
    const characterId = (new URLSearchParams(window.location.search)).get('id');

    // Request character data from XIVAPI.
    let characterData = (await requestData("character/" + characterId)).Character;

    document.title = "FFXIV Tracker - " + characterData.Name;

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
        document.getElementById('prefix-name').innerHTML = titleData.Name + " ...";
    } else {
        document.getElementById('suffix-name').innerHTML = "... " + titleData.Name;
    }

    // Current job display section
    // Display level experience bar.
    let ratio = (characterData.ActiveClassJob.ExpLevel / characterData.ActiveClassJob.ExpLevelMax)*100;
    document.getElementById('level-experience').style.width = ratio.toString() + "%";

    // Request job icon from XIVAPI.
    let jobData = await requestData("ClassJob/" + characterData.ActiveClassJob.JobID);

    document.getElementById('active-job-icon').setAttribute('src', "https://xivapi.com/cj/svg/ClassJob/" + jobAbreviation + ".svg");

    // Main Scenario Quest Timeline
    // This array holds the achievement id of the following expansion completion achievements.
    // A Realm Reborn, Heavensward, Stormblood, Shadowbringers, Endwalker.
    const achievementReference = [788, 1139, 1794, 2298, 2958];


    // Populate job stats container.
    const jobStats = document.getElementById('job-stats');
    const jobs = characterData.ClassJobs;

    for(let i = 0; i < jobs.length; i++) {
        let index = (jobs[i].Name).indexOf("/");
        let jobName = ((jobs[i].Name).slice(index+1)).replace(/ /g, "");

        const jobDiv = document.createElement("div");
        const jobIcon = document.createElement("img");
        const jobLbl = document.createElement("p");

        jobIcon.setAttribute('src', "https://xivapi.com/cj/companion/" + jobName + ".png");
        jobIcon.setAttribute('class', "job-icon");
        jobLbl.innerHTML = jobs[i].Level;

        jobDiv.append(jobIcon);
        jobDiv.append(jobLbl);
        jobStats.append(jobDiv);
        
    }


}


// Function to make requests to XIVAPI
async function requestData(content) {
    let response = await fetch("https://xivapi.com/" + content, {mode: 'cors'});
    let data = await response.json();

    return data;
}

main();