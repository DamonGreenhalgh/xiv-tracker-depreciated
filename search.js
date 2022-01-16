// Links navbar searchbar to main search index.
document.getElementById('search-button').addEventListener('click', function() {
    const characterName = document.getElementById('character-name-textbox').value;
    const serverName = document.getElementById('server-list').value;

    document.location.href = "index.html?name=" + characterName + "&server=" + serverName;
});
document.getElementById('character-name-textbox').addEventListener('keyup', function(event) {
    if (event.key == "Enter") {
        document.getElementById('search-button').click();
    }
});
