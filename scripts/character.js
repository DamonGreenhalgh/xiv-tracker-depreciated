async function main() {

    // Get character id and name from url parameter.
    const searchParams = new URLSearchParams(window.location.search);
    const characterId = searchParams.get('id');
    const characterName = searchParams.get('name');

    document.title = characterName + " | XIV Tracker";
    document.getElementById('character-name').innerText = characterName;

    // Load server json file
    let serverData;
    fetch("data.json")
        .then(response => response.json())
        .then(data => serverData = data);

    const tabId = ['attributes', 'profile', 'mounts', 'minions'];
    let currentTabIndex;

    // Add action listeners to each tab button so users can switch between content.
    for (let i = 0; i < tabId.length; i++) {

        // On Click event
        document.getElementById(tabId[i] + '-tab-button').addEventListener('click', function() {

            // Disable other tab buttons and hide current content.
            for (let i = 0; i < tabId.length; i++) {

                // Style change to indicate hidden content
                document.getElementById(tabId[i] + '-tab-button').setAttribute('class', "button");

                // Hide current content.
                document.getElementById(tabId[i] + '-panel').style.visibility = "hidden";
            }

            // Style change to indicate button is selected.
            document.getElementById(tabId[i] + '-tab-button').setAttribute('class', "button button--active");

            // Make associated content visibile
            document.getElementById(tabId[i] + '-panel').style.visibility = "visible";

            currentTabIndex = i;
        })
    }

    // Default tab on window open.
    document.getElementById('attributes-tab-button').click();

    // Action listener for the show more button for quests.
    let showQuestContent = false;
    document.getElementById('show-quests').addEventListener('click', function() {
        if (showQuestContent) {
            document.getElementById('quests').style.height = "60.5rem";
            document.getElementById('show-quests').innerText = "Show More";
            showQuestContent = false;
        } else {
            document.getElementById('quests').style.height = "190rem";
            document.getElementById('show-quests').innerText = "Show Less";
            showQuestContent = true;
        }
    });



    // General Character Information
    // -----------------------------

    // Request character data from XIVAPI.
    let data = await requestData("character/" + characterId);
    let characterData = data.Character;
    
    // Display data to the user.
    document.getElementById('character-server').innerText = characterData.Server;
    document.getElementById('character-avater').setAttribute('src', characterData.Avatar);
    document.getElementById('character-portrait').style.backgroundImage = "url('" + characterData.Portrait + "')";
    document.getElementById('active-job-level').innerText = "Lv. " + characterData.ActiveClassJob.Level;

    // Load title
    let titleData = (await requestData("title/" + characterData.Title));

    // Determine if it is a prefix or suffix.   
    const titleType = titleData.IsPrefix ? 'prefix-name' : 'suffix-name'; 
    document.getElementById(titleType).innerText = titleData.Name;

    // Load job icon
    document.getElementById('active-job-icon').setAttribute('src', "img/job-svg/" + characterData.ActiveClassJob.UnlockedState.Name.toLowerCase() + ".svg");

    // Atrribute Panel
    // ---------------
    const attributeNames = ["Strength", "Dexterity", "Vitality", "Intelligence", "Mind", "Piety", "HP", "MP", "Tenacity", "Attack Power", "Defense", "Direct Hit Rate", "Magic Defense", "Critical Hit", "Attack Magic Potency", "Healing Magic Potency", "Determination", "Skill Speed", "Spell Speed"];
    const attributeValues = Object.values(characterData.GearSet.Attributes);
    for(let i = 0; i < attributeNames.length; i++) {

        const attributeName = document.createElement('p');
        const attributeValue = document.createElement('p');

        attributeName.setAttribute('class', "secondary-text");
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

            // Create tooltip and frame for the item.
            const tooltipDiv = document.createElement('div');
            const itemFrame = document.createElement('img');

            itemFrame.setAttribute('class', "icon");
            itemFrame.setAttribute('src', "img/job-misc/item-frame.png");
            tooltipDiv.setAttribute('class', "tooltip");
            tooltipDiv.innerText = equipmentData.Name;

            document.getElementById(itemType[i]).append(tooltipDiv);
            document.getElementById(itemType[i]).append(itemFrame);

        } catch(error) { }
    }



    // Profile Panel Information
    // ------------------------

    // Profile data, will be stored in JSON eventually.
    const grandCompanyTypes = ["Maelstrom", "Order of the Twin Adder", "Immortal Flames"];
    const genderTypes = ["male", "female"];
    const raceTypes = ["Hyur", "Elezen", "Lalafell", "Miqo'te", "Roegadyn", "Au Ra", "Hrothgar", "Viera"];
    const tribeTypes = ["Midlander", "Highlander", "Wildwood", "Duskwight", "Plainsfolk", "Dunesfolk", "Seeker of the Sun", "Keeper of the Moon", "Sea Wolf", "Hellsguard", "Raen", "Xaela", "Helions", "The Lost", "Rava", "Veena"];
    const cityStateTypes = ["Limsa Lominsa", "Gridania", "Ul'dah"];
    const cityStateIconNames = ["limsa-lominsa", "gridania", "ul-dah"];

    document.getElementById('race-clan').innerText = raceTypes[characterData.Race-1] + ", " + tribeTypes[characterData.Tribe-1];
    document.getElementById('gender').style.backgroundImage = "url('img/gender/" + genderTypes[characterData.Gender-1] + ".png')";
    document.getElementById('city-state').innerText = cityStateTypes[characterData.Town-1];
    document.getElementById('city-state-icon').style.backgroundImage = "url('img/city-states/" + cityStateIconNames[characterData.Town-1] + ".png')";
    document.getElementById('name-day').innerText = characterData.Nameday;

    // Load Free Company Information
    if (characterData.FreeCompanyName) {

        document.getElementById('free-company-name').innerText = characterData.FreeCompanyName;

        const freeCompanyData = await requestData("FreeCompany/" + characterData.FreeCompanyId);

        document.getElementById('free-company-crest-1').style.backgroundImage = "url('" + freeCompanyData.FreeCompany.Crest[0] + "')";
        document.getElementById('free-company-crest-2').style.backgroundImage = "url('" + freeCompanyData.FreeCompany.Crest[1] + "')";
        document.getElementById('free-company-crest-3').style.backgroundImage = "url('" + freeCompanyData.FreeCompany.Crest[2] + "')";

    }

    // Load Grand Company Information
    if (characterData.GrandCompany) {

        document.getElementById('grand-company-name').innerText = grandCompanyTypes[characterData.GrandCompany.NameID-1];
        document.getElementById('grand-company-icon').style.backgroundImage = "url('https://xivapi.com/img-misc/gc/character_gc_" + characterData.GrandCompany.NameID + "_" + characterData.GrandCompany.RankID + ".png')";

    }

    // Guardian Deity Data
    let guardianData = await requestData("GuardianDeity/" + characterData.GuardianDeity);
    document.getElementById('guardian-icon').style.backgroundImage = "url('https://xivapi.com" + guardianData.IconHD + "')";
    document.getElementById('guardian-name').innerText = guardianData.Name;



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

            // Data is locally stored, retrieve.
            minionData = storedData[characterId].Minions;
            mountData = storedData[characterId].Mounts;
        }

    } else {

        minionData = data.Minions;
        mountData = data.Mounts;

        // If data is valid, store into local storage.
        storedData[characterId] = {"Minions": minionData, "Mounts": mountData};
        localStorage.setItem("storedData", JSON.stringify(storedData));
    } 


    // Check to see if character has valid mount and minion data to display.
    if (mountData !== undefined && minionData !== undefined) {
        const pageCapacity = 49;
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


    // Jobs
    // ----

    let job;

    const jobLevel = document.getElementsByClassName('jobs__level');
    const jobName = document.getElementsByClassName('jobs__name');
    const jobProgress = document.getElementsByClassName('jobs__bar--active');

    for (let i = 0; i < characterData.ClassJobs.length; i++) {

        job = characterData.ClassJobs[i];

        jobLevel[i].innerText = job.Level;
        jobProgress[i].style.width = (job.ExpLevel / job.ExpLevelMax * 100).toString() + "%";

        if (job.Level == 90) {
            jobLevel[i].style.color = "var(--job-max-level-color)";
        }

        if (job.Level == 0) {
            jobLevel[i].innerText = "-";
            jobLevel[i].style.color = "var(--text-midground-color)";
            jobName[i].style.color = "var(--text-midground-color)";
        }

    }

    document.getElementById('jobs').style.filter = "none";
    



    // Quests
    // ------
    let achievementData = (await requestData("character/" + characterId + "?data=AC")).Achievements.List;

    // Check if character has achievements public.
    if (achievementData.length !== 0) {

        let characterAchievements = [];
        // Parse data
        for (let i = 0; i < achievementData.length; i++) {
            characterAchievements.push(achievementData[i].ID);
        }
        achievementData = characterAchievements;

        // MSQ Achievements
        const msqId = Object.values(serverData.msq);
        const msqList = document.getElementById('msq-list').getElementsByTagName('li');
        let completedMainQuests = 0;
        
        for (let i = 0; i < msqId.length; i++) {
            if (achievementData.includes(msqId[i])) {
                msqList[i].style.color = "var(--completed-color)";
                completedMainQuests++;
            }
        }


        // Compute the height required to meet current quest.
        const maxIndex = completedMainQuests-1;
        const msqListChildren = document.getElementById('msq-list').childNodes;
        const currentQuest = msqListChildren[1 + 2*maxIndex];
        const msqProgressBarHeight = currentQuest.getBoundingClientRect().y - document.getElementById('msq-list').getBoundingClientRect().y;
        document.getElementById('msq-bar').style.height = (msqProgressBarHeight + currentQuest.getBoundingClientRect().height/2).toString() + "px";      
        document.getElementById('msq-bar-point').style.top = (msqProgressBarHeight - currentQuest.getBoundingClientRect().height/2).toString() + "px";   


        // Checklist
        const dungeonId = Object.values(serverData.dungeons);
        const trialId = Object.values(serverData.trials);
        const normalRaidId = Object.values(serverData.raids.normal);
        const allianceRaidId = Object.values(serverData.raids.alliance);
        const savageRaidId = Object.values(serverData.highEnd.savage);
        const ultimateRaidId = Object.values(serverData.highEnd.ultimate);

        const completedDungeons = displayActivityCompletion(dungeonId, 'dungeons', achievementData);
        const completedTrials = displayActivityCompletion(trialId, 'trials', achievementData);
        const completedNormalRaids = displayActivityCompletion(normalRaidId, 'normal-raids', achievementData);
        const completedAllianceRaids = displayActivityCompletion(allianceRaidId, 'alliance-raids', achievementData);
        const completedSavageRaids = displayActivityCompletion(savageRaidId, 'savage-raids', achievementData);
        const completedUltimateRaids = displayActivityCompletion(ultimateRaidId, 'ultimate-raids', achievementData);

        // Set percentage completion labels.
        document.getElementById("main-scenario-completion-label").innerText = (Math.ceil(completedMainQuests / msqId.length * 100)).toString() + "%";
        document.getElementById("dungeons-completion-label").innerText = (Math.ceil(completedDungeons / dungeonId.length * 100)).toString() + "%";
        document.getElementById("trials-completion-label").innerText = (Math.ceil(completedTrials / trialId.length * 100)).toString() + "%";
        document.getElementById("raids-completion-label").innerText = (Math.ceil((completedNormalRaids + completedAllianceRaids) / (normalRaidId.length + allianceRaidId.length) * 100)).toString() + "%";
        document.getElementById("high-end-completion-label").innerText = (Math.ceil((completedSavageRaids + completedUltimateRaids) / (savageRaidId.length + ultimateRaidId.length) * 100)).toString() + "%";

        // Remove blur filter when everything has been loaded.
        document.getElementById('quests').style.filter = "none";   

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
        const item = document.createElement('div');
        const tooltip = document.createElement('div');
        const frame = document.createElement('img');

        tooltip.setAttribute('class', "tooltip");
        item.setAttribute('class', "item");
        frame.setAttribute('src', "img/job-misc/item-frame.png");
        frame.setAttribute('class', "icon");

        tooltip.innerText = content[i].Name;
        item.style.backgroundImage = "url('" + content[i].Icon + "')";

        item.append(frame);
        item.append(tooltip);
        document.getElementById(pageType).append(item);
    }

    // Update display label to display page number.
    document.getElementById(labelName).innerText = pageNumber;
}

// This function highlights and checkmarks all completed duties/quests.
function displayActivityCompletion(id, type, achievements) {

    document.getElementById(type + "-list").style.marginLeft = "0";
    // Get duty/quest lists
    const dutyList = document.getElementById(type + "-list").getElementsByTagName('li');

    let completedCount = 0;

    for (let i = 0; i < id.length; i++) {

        // For each duty/quest, check if character has completed it.
        const duty = dutyList[i];

        if (achievements.includes(id[i])) {

            // Yes, styling
            const checkmark = document.createElement('img');
            checkmark.setAttribute('class', "quests__checkmark");
            checkmark.setAttribute('src', "img/checkmark.png");

            duty.prepend(checkmark);
            duty.setAttribute('class', "quests-text--complete");

            completedCount++;

        } else {

            // No, styling
            duty.setAttribute('class', duty.className + " quests-text--incomplete");
        }
    }

    const dutyHeaders = document.getElementById(type + "-list").getElementsByTagName('h3');
    for (let i = 0; i < dutyHeaders.length; i++) {
        dutyHeaders[i].style.marginLeft = "6rem";
    }

    return completedCount;

}

main();

