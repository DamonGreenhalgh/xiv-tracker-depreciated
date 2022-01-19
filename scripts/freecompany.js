async function freeCompany() {

    // Request free company data.
    await fetch("https://xivapi.com/freecompany/" + characterData.FreeCompanyId, {mode: 'cors'})
        .then(response => response.json())
        .then(data => freeCompanyData = data.FreeCompany);

    // Update Free Company Banner
    document.getElementById('free-company-banner-name').innerText = freeCompanyData.Name;
    document.getElementById('free-company-slogan').innerText = freeCompanyData.Slogan;
    document.getElementById('free-company-avatar-1').setAttribute('src', freeCompanyData.Crest[0]);
    document.getElementById('free-company-avatar-2').setAttribute('src', freeCompanyData.Crest[1]);
    document.getElementById('free-company-avatar-3').setAttribute('src', freeCompanyData.Crest[2]);
    document.getElementById('free-company-rank').innerText = "Rank: " + freeCompanyData.Rank;

    // Update Profile Elements
    document.getElementById('free-company-crest-1').style.backgroundImage = "url('" + freeCompanyData.FreeCompany.Crest[0] + "')";
    document.getElementById('free-company-crest-2').style.backgroundImage = "url('" + freeCompanyData.FreeCompany.Crest[1] + "')";
    document.getElementById('free-company-crest-3').style.backgroundImage = "url('" + freeCompanyData.FreeCompany.Crest[2] + "')";
    document.getElementById('free-company-name').innerText = characterData.FreeCompanyName;
}