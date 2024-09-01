document.getElementById('saveButton').addEventListener('click', function() {
    const digits = document.getElementById('cardDigits').value;
    const name = document.getElementById('cardName').value;

    if (digits && name) {
        let data = {};
        data[digits] = name;
        chrome.storage.local.set(data, function() {
            alert('Card name saved!');
        });
    } else {
        alert('Please enter both digits and a name.');
    }
});
