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

    for (let i = 0; i < tabId.length; i++) {

        // Add action listeners to each tab button so users can switch between content.
        document.getElementById(tabId[i] + '-tab-button').addEventListener('click', function() {

            // Disable other tab buttons and hide current content.
            for (let i = 0; i < tabId.length; i++) {

                document.getElementById(tabId[i] + '-tab-button').setAttribute('class', "button");
                document.getElementById(tabId[i] + '-panel').style.visibility = "hidden";
            }

            // Enable current content.
            document.getElementById(tabId[i] + '-tab-button').setAttribute('class', "button button--active");
            document.getElementById(tabId[i] + '-panel').style.visibility = "visible";

            currentTabIndex = i;
        })
    }

    // Default tab on window open.
    document.getElementById('attributes-tab-button').click();

    // Action listener for the show more button for quests.
    let showQuestContent = false;
    const showQuestsBtn = document.getElementById('show-quests');
    const questContent = document.getElementById('quests');

    showQuestsBtn.addEventListener('click', function() {

        if (showQuestContent) {

            questContent.style.height = "60.5rem";
            showQuestsBtn.innerText = "Show More";
            showQuestContent = false;

        } else {

            questContent.style.height = "190rem";
            showQuestsBtn.innerText = "Show Less";
            showQuestContent = true;

        }
    });


    // General Character Information
    // -----------------------------
    let characterData;
    await fetch("https://xivapi.com/character/" + characterId + "?extended=1", {mode: "cors"})
        .then(response => response.json())
        .then(data => characterData = data.Character)
    
    console.log(characterData);

    // Update DOM elements with recieved data for xivapi
    document.getElementById('character-server').innerText = characterData.Server;
    document.getElementById('character-avater').setAttribute('src', characterData.Avatar);
    document.getElementById('character-portrait').style.backgroundImage = "url('" + characterData.Portrait + "')";
    document.getElementById('active-job-level').innerText = "Lv. " + characterData.ActiveClassJob.Level;
    document.getElementById('active-job-icon').setAttribute('src', "img/job-svg/" + characterData.ActiveClassJob.Job.Name.replace(/ /g, "") + ".svg");

    // Determine if the title is a prefix or suffix.
    const titleType = characterData.TitleTop ? 'prefix-name' : 'suffix-name'; 
    document.getElementById(titleType).innerText = characterData.Title.Name;

    // Load gear icons
    const equipmentType = Object.keys(characterData.GearSet.Gear);
    let gear;

    for (let i = 0; i < equipmentType.length; i++) {

        // Set gear icon
        gear = document.getElementById(equipmentType[i]);
        gear.style.backgroundImage = "url('https://xivapi.com" + characterData.GearSet.Gear[equipmentType[i]].Item.Icon.slice(0, -4) + "_hr1.png')";
        
        // Create tooltip and item frame and append to gear element.
        const tooltip = document.createElement('div');
        const frame = document.createElement('img');

        frame.setAttribute('class', "icon");
        frame.setAttribute('src', "img/job-misc/item-frame.png");
        tooltip.setAttribute('class', "tooltip");
        tooltip.innerText = characterData.GearSet.Gear[equipmentType[i]].Item.Name;

        gear.append(tooltip);
        gear.append(frame); 

    }



    // Atrributes
    // ----------

    const attributeType = characterData.GearSet.Attributes;
    const attributeTypeLength = attributeType.length;
    const attributeListElement = document.getElementById('attributes-list').getElementsByTagName('li');
    
    for (let i = 0; i < attributeTypeLength - 2; i++) {

        attributeListElement[i].innerText = attributeType[i].Value;

    }

    // Set hp and mp values
    document.getElementById('hp').innerText = attributeType[attributeTypeLength - 2].Value;
    document.getElementById('mp').innerText = attributeType[attributeTypeLength - 1].Value;



    // Profile
    // -------
    document.getElementById('race-clan').innerText = characterData.Race.Name + ", " + characterData.Tribe.Name;
    document.getElementById('gender').style.backgroundImage = "url('img/gender/" + characterData.Gender + ".png')";
    document.getElementById('city-state').innerText = characterData.Town.Name;
    document.getElementById('city-state-icon').style.backgroundImage = "url('https://xivapi.com" + characterData.Town.Icon.slice(0, -4) + "_hr1.png')";
    document.getElementById('name-day').innerText = characterData.Nameday;
    document.getElementById('guardian-icon').style.backgroundImage = "url('https://xivapi.com" + characterData.GuardianDeity.Icon + "')";
    document.getElementById('guardian-name').innerText = characterData.GuardianDeity.Name;


    // If the character is associated with a grand company.
    if (characterData.GrandCompany.Company !== null) {
        document.getElementById('grand-company-name').innerText = characterData.GrandCompany.Company.Name;
        document.getElementById('grand-company-icon').style.backgroundImage = "url('https://xivapi.com" + characterData.GrandCompany.Rank.Icon + "')";
    }

    // If the character is associated with a free company.
    if (characterData.FreeCompany !== undefined) {
        document.getElementById('free-company-name').innerText = characterData.FreeCompanyName;

        let freeCompanyData;
        await fetch("https://xivapi.com/freecompany/" + characterData.FreeCompanyId, {mode: "cors"})
            .then(response => response.json())
            .then(data => freeCompanyData = data);

        document.getElementById('free-company-crest-1').style.backgroundImage = "url('" + freeCompanyData.FreeCompany.Crest[0] + "')";
        document.getElementById('free-company-crest-2').style.backgroundImage = "url('" + freeCompanyData.FreeCompany.Crest[1] + "')";
        document.getElementById('free-company-crest-3').style.backgroundImage = "url('" + freeCompanyData.FreeCompany.Crest[2] + "')";
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

        // Calculate the % of progress within the job level and display.
        jobProgress[i].style.width = (job.ExpLevel / job.ExpLevelMax * 100).toString() + "%";

        // If job is a max level.
        if (job.Level == 90) {
            jobLevel[i].style.color = "var(--job-max-level-color)";
        }

        // If job is not aquired yet.
        if (job.Level == 0) {
            jobLevel[i].innerText = "-";
            jobLevel[i].style.color = "var(--text-midground-color)";
            jobName[i].style.color = "var(--text-midground-color)";
        }
    }

    document.getElementById('jobs').style.filter = "none";

    




    
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

/**DisplayActivityCompeltion
 * 
 * Description: This function updates the list items of the quests section of 
 * the webpage. If the character has completed a certain quest/duty, it will be 
 * marked with green text and a checkmark.
 * 
 * Params:
 * id: An array containing specific xivapi achievements id.
 * type: A string used to get elements in the DOM.
 * achievements: An array containing all the character achievement ids.
 * 
 * Return:
 * count: An integer representing the number of completed duties/quests.
 * */ 
function displayActivityCompletion(id, type, achievements) {

    document.getElementById(type + "-list").style.marginLeft = "0";

    // Get duty/quest lists
    const dutyList = document.getElementById(type + "-list").getElementsByTagName('li');

    let count = 0;

    for (let i = 0; i < id.length; i++) {

        const duty = dutyList[i];

        // For each duty/quest, check if character has completed it.
        if (achievements.includes(id[i])) {

            // Yes, styling
            const checkmark = document.createElement('img');
            checkmark.setAttribute('class', "quests__checkmark");
            checkmark.setAttribute('src', "img/checkmark.png");

            duty.prepend(checkmark);
            duty.setAttribute('class', "quests-text--complete");

            count++;

        } else {

            // No, styling
            duty.setAttribute('class', duty.className + " quests-text--incomplete");
        }
    }

    const dutyHeaders = document.getElementById(type + "-list").getElementsByTagName('h3');
    for (let i = 0; i < dutyHeaders.length; i++) {
        dutyHeaders[i].style.marginLeft = "6rem";
    }

    return count;
}

main();

