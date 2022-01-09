async function main() {

    // Get character id and name from url parameter.
    const searchParams = new URLSearchParams(window.location.search);
    const characterId = searchParams.get('id');
    const characterName = searchParams.get('name');

    document.title = characterName + " | XIV Tracker";

    const tabId = ['attributes', 'profile', 'job', 'mounts', 'minions'];
    let currentTabIndex;

    // Add action listeners to each tab button so users can switch between content.
    for (let i = 0; i < tabId.length; i++) {

        // On Click event
        document.getElementById(tabId[i] + '-tab-button').addEventListener('click', function() {

            // Disable other tab buttons and hide current content.
            for (let i = 0; i < tabId.length; i++) {

                // Style change to indicate hidden content
                document.getElementById(tabId[i] + '-tab-button').setAttribute('class', "tab-button");

                // Hide current content.
                document.getElementById(tabId[i] + '-panel').style.visibility = "hidden";
            }

            // Style change to indicate button is selected.
            document.getElementById(tabId[i] + '-tab-button').setAttribute('class', "tab-button-active");

            // Make associated content visibile
            document.getElementById(tabId[i] + '-panel').style.visibility = "visible";

            currentTabIndex = i;
        })
    }

    // Default tab on window open.
    document.getElementById('attributes-tab-button').click();



    // General Character Information
    // -----------------------------

    // Request character data from XIVAPI.
    let data = await requestData("character/" + characterId);
    let characterData = data.Character;
    console.log(characterData);
    const jobAbreviation = (await requestData("ClassJob/" + characterData.ActiveClassJob.ClassID)).Abbreviation
    
    // Display data to the user.
    document.getElementById('character-name').innerText = characterName;
    document.getElementById('character-avater').setAttribute('src', characterData.Avatar);
    document.getElementById('character-portrait').style.backgroundImage = "url('" + characterData.Portrait + "')";
    document.getElementById('active-job-level').innerText = "Lv. " + characterData.ActiveClassJob.Level;

    // Load title
    let titleData = (await requestData("title/" + characterData.Title));

    // Determine if the title is a prefix or suffix, then display on character banner.
    if (titleData.IsPrefix) {
        document.getElementById('prefix-name').innerText = titleData.Name;
    } else {
        document.getElementById('suffix-name').innerText = titleData.Name;
    }
    
    // Load job icon
    let jobData = await requestData("ClassJob/" + characterData.ActiveClassJob.JobID);
    document.getElementById('active-job-icon').setAttribute('src', "https://xivapi.com/cj/svg/ClassJob/" + jobData.Abbreviation + ".svg");
    

    // Atrribute Panel
    // ---------------
    const attributeNames = ["Strength", "Dexterity", "Vitality", "Intelligence", "Mind", "Piety", "HP", "MP", "Tenacity", "Attack Power", "Defense", "Direct Hit Rate", "Magic Defense", "Critical Hit", "Attack Magic Potency", "Healing Magic Potency", "Determination", "Skill Speed", "Spell Speed"];
    const attributeValues = Object.values(characterData.GearSet.Attributes);
    for(let i = 0; i < attributeNames.length; i++) {

        const attributeName = document.createElement('p');
        const attributeValue = document.createElement('p');

        attributeName.setAttribute('class', "secondary-text");
        attributeName.style.gridColumn = "span 3";
        attributeName.innerText = attributeNames[i];

        attributeValue.style.textAlign = "end";
        attributeValue.innerText = attributeValues[i];

        document.getElementById('attributes').append(attributeName);
        document.getElementById('attributes').append(attributeValue);


    }

    document.getElementById('hp').innerText = attributeValues[6];
    document.getElementById('mp').innerText = attributeValues[7];





    // Character Equipment Information
    // -------------------------------
    
    // Load equiment.
    const itemType = ["MainHand", "Head", "Hands", "Body", "Legs", "Feet", "Earrings", "Necklace", "Bracelets", "Ring1", "Ring2", "SoulCrystal", "OffHand"];
    for (let i = 0; i < itemType.length; i++) {

        try {

            // Request equipment data.
            const equipmentData = await requestData("Item/" + characterData.GearSet.Gear[itemType[i]].ID);

            // Get icon for equipment piece.
            const imageSource = "url('https://xivapi.com" + equipmentData.IconHD + "')";
            document.getElementById(itemType[i]).style.backgroundImage = imageSource;

            // Create tooltip for item, add it to the item div.
            const tooltipDiv = document.createElement('div');
            tooltipDiv.setAttribute('class', "tooltip");
            tooltipDiv.innerText = equipmentData.Name;
            document.getElementById(itemType[i]).append(tooltipDiv);

        } catch(error) {
            console.log(itemType[i] + " does not exist.");
        }
    }



     // Profile Panel Information
    // ------------------------

    // Profile data, will be stored in JSON eventually.
    const grandCompanyTypes = ["Maelstrom", "Order of the Twin Adder", "Immortal Flames"];
    const genderTypes = ["male", "female"];
    const raceTypes = ["Hyur", "Elezen", "Lalafell", "Miqo'te", "Roegadyn", "Au Ra", "Hrothgar", "Viera"];
    const tribeTypes = ["Midlander", "Highlander", "Wildwood", "Duskwight", "Plainsfolk", "Dunesfolk", "Seeker of the Sun", "Keeper of the Moon", "Sea Wolf", "Hellsguard", "Raen", "Xaela", "Helions", "The Lost", "Rava", "Veena"];
    const cityStateTypes = ["Limsa Lominsa", "Gridania", "Ul'dah"];

    document.getElementById('race-clan').innerText = raceTypes[characterData.Race-1] + ", " + tribeTypes[characterData.Tribe-1];
    document.getElementById('gender').style.backgroundImage = "url('img/gender/" + genderTypes[characterData.Gender-1] + ".png')";
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



    // Jobs Panel Information
    // ----------------------

    // Populate job stats container.
    const jobs = characterData.ClassJobs;

    for(let i = 0; i < jobs.length; i++) {
        const index = (jobs[i].Name).indexOf("/");
        const jobName = ((jobs[i].Name).slice(index+1)).replace(/ /g, "");

        const jobDiv = document.createElement("div");
        const jobIcon = document.createElement("img");
        const jobLbl = document.createElement("p");

        jobDiv.setAttribute('class', "job-item-container");
        jobIcon.setAttribute('src', "https://xivapi.com/cj/1/" + jobName + ".png");
        jobIcon.setAttribute('class', "job-icon");
        jobLbl.setAttribute('class', "job-label");

        jobLbl.innerText = jobs[i].Level;

        // If job is max level, change color to indicate the status.
        if (jobLbl.innerText == "90") {
            jobLbl.style.color = "var(--job-max-level-color)"
        } else if (jobLbl.innerText == "0") {
            jobLbl.innerText = "-";
            jobLbl.style.color = "var(--text-midground-color)"
        }

        jobDiv.append(jobIcon);
        jobDiv.append(jobLbl);

        if (i < 20) {
            document.getElementById('war-magic-jobs').append(jobDiv);
        } else {
            document.getElementById('hand-land-jobs').append(jobDiv);
        }
    }



    // Minions and Mounts
    // ------------------

    let minionData, mountData;
    let storedData = localStorage.getItem("storedData");

    if (storedData == null) {
        localStorage.setItem("storedData", "{}");
    }

    storedData = JSON.parse(localStorage.getItem("storedData"));

    // Call XIVAPI for character data.
    data = await requestData("character/" + characterId + "?data=MIMO");



    // If XIVAPI does not return mount and minion data, look in local storage to see if it was retrieved and stored
    // before. If so, load that data.

    // Check if XIVAPI returns null;
    if (data.Minions == null || data.Mounts == null) {

        // Check if data has been stored loacally.
        if (storedData[characterId] != null) {

            console.log("Mount and minion data is locally stored, retrieving.")

            // Data is locally stored, retrieve.
            minionData = storedData[characterId].Minions;
            mountData = storedData[characterId].Mounts;

        } else {

            console.log("Character does not have any mounts/minions.")
        }
    
    } else {

        minionData = data.Minions;
        mountData = data.Mounts;

        // If data is valid, store into local storage.
        storedData[characterId] = {"Minions": minionData, "Mounts": mountData};
        localStorage.setItem("storedData", JSON.stringify(storedData));

        console.log("Mounts and minions have been stored!")
    } 


    // Check to see if character has valid mount and minion data to display.
    if (mountData !== undefined && minionData !== undefined) {
        const pageCapacity = 42;
        let currentMountPage = 1;
        let currentMinionPage = 1;
        const lastMountPage = Math.ceil(mountData.length / pageCapacity);
        const lastMinionPage = Math.ceil(minionData.length / pageCapacity);

        displayPage(pageCapacity, currentMountPage, 'mount-gallery', mountData, 'mount-page-number-label');
        displayPage(pageCapacity, currentMinionPage, 'minion-gallery', minionData, 'minion-page-number-label');

        // Page listeners.
        document.getElementById('mount-next-page-button').addEventListener('click', function() {
            if(currentMountPage < lastMountPage) {
                currentMountPage++;
                displayPage(pageCapacity, currentMountPage, 'mount-gallery', mountData, 'mount-page-number-label');
            }
        });

        document.getElementById('mount-prev-page-button').addEventListener('click', function() {
            if(currentMountPage > 1) {
                currentMountPage--;
                displayPage(pageCapacity, currentMountPage, 'mount-gallery', mountData, 'mount-page-number-label');
            }
        });

        document.getElementById('minion-next-page-button').addEventListener('click', function() {
            if(currentMinionPage < lastMinionPage) {
                currentMinionPage++;
                displayPage(pageCapacity, currentMinionPage, 'minion-gallery', minionData, 'minion-page-number-label');
            }
        });

        document.getElementById('minion-prev-page-button').addEventListener('click', function() {
            if(currentMinionPage > 1) {
                currentMinionPage--;
                displayPage(pageCapacity, currentMinionPage, 'minion-gallery', minionData, 'minion-page-number-label');
            }
        });
    }

    // Main Scenario Quests
    // This array holds the achievement id of msq.
    const achievementReference = [788,  0, 0, 1001, 1029, 1129,  1139,  1387, 1493, 1594, 1630, 1691,  1794,  0, 0, 2098, 2124, 2233,  2298,  2424, 2587, 2642, 2714, 2851,  2958];
    const achievementData = (await requestData("character/" + characterId + "?data=AC")).Achievements;

    // Check if character has achievements public.
    if (achievementData.List.length !== 0) {

        let maxAchievement = 0;

        // Find the highest msq id achievement.
        for (let i = 0; i < achievementData.List.length; i++) {
            
            let achievementID = achievementData.List[i].ID
            if(achievementReference.includes(achievementID) && achievementID > maxAchievement) {
                maxAchievement = achievementID;
            }
        }

        // Compute the height required to meet current quest.
        const maxIndex = achievementReference.indexOf(maxAchievement);
        const msqListChildren = document.getElementById('msq-list').childNodes;
        const currentQuest = msqListChildren[1 + 2*maxIndex];
        const msqProgressBarHeight = currentQuest.getBoundingClientRect().y - document.getElementById('msq-list').getBoundingClientRect().y;

        currentQuest.style.color = "var(--msq-bright-color)";
        document.getElementById('msq-bar').style.height = (msqProgressBarHeight + currentQuest.getBoundingClientRect().height/2).toString() + "px";      
        document.getElementById('msq-bar-point').style.top = (msqProgressBarHeight - currentQuest.getBoundingClientRect().height/2).toString() + "px";   
        document.getElementById('quests').style.filter = "none";     

        // Strike through all completed main scenario quests.
        console.log(maxIndex);
        for (let i = 1; i < maxIndex*2; i = i + 2) {
            msqListChildren[i].style.textDecoration = "line-through";
        }
  
    } else {
        console.log("Character has public achievements disabled!")
    }
}

// Function to make requests to XIVAPI
async function requestData(content) {
    let response = await fetch("https://xivapi.com/" + content, {mode: 'cors'});
    let data = await response.json();

    return data;
}


// Function to display current page for mounts and minions.
function displayPage(pageCapacity, pageNumber, pageType, content, labelName) {

    // Clear gallery
    document.getElementById(pageType).innerText = "";

    // Load page elements
    for(let i = (pageNumber-1) * pageCapacity; i < Math.min(pageNumber * pageCapacity, content.length); i++) {

        // Create item to display.
        const itemDiv = document.createElement('div');
        const tooltipDiv = document.createElement('div');
        tooltipDiv.setAttribute('class', "tooltip");
        tooltipDiv.innerText = content[i].Name;
        itemDiv.append(tooltipDiv);
        itemDiv.setAttribute('class', "item");
        itemDiv.style.backgroundImage = "url('" + content[i].Icon + "')";
        document.getElementById(pageType).append(itemDiv);
    }

    // Update display label to display page number.
    document.getElementById(labelName).innerText = pageNumber;

}

main();