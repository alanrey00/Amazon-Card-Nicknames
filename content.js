// Function to create a tooltip that is always visible
function createAlwaysVisibleTooltip(element, lastFour, name) {

    // Create the tooltip container
    const tooltip = document.createElement('span');
    tooltip.className = 'card-tooltip';
    tooltip.style.display = 'block'; // Always visible

    // Create text for the tooltip
    const text = document.createElement('span');
    text.textContent = name ? `(${name})` : ''; // Display name in parentheses if available

    // Create "Edit Name" link
    const editLink = document.createElement('a');
    editLink.href = '#';
    editLink.textContent = 'Edit Nickname';
    editLink.className = 'edit-link';

    // Append text and "Edit Name" link to the tooltip
    tooltip.appendChild(text);
    tooltip.appendChild(editLink);

    // Create and append input field for the name
    const input = document.createElement('input');
    input.type = 'text';
    input.value = name || ""; // Default to empty string if no name
    input.style.width = '120px';
    input.style.display = 'none'; // Initially hidden

    // Show the input field when "Edit Name" is clicked
    editLink.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent link default action
        text.style.display = 'none'; // Hide text
        editLink.style.display = 'none'; // Hide "Edit Name" link
        input.style.display = 'inline'; // Show input field
        input.focus(); // Focus the input field
    });

    // Prevent other keyboard events when input is focused
    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === 'Escape') {
            event.preventDefault(); // Prevent default action
            // Handle the Enter key to save changes
            if (event.key === 'Enter') {
                input.dispatchEvent(new Event('change')); // Trigger change event
            }
        }
    });

    // Save the name to storage when input changes
    input.addEventListener('change', () => {
        const newName = input.value;
        let data = {};
        data[lastFour] = newName;
        chrome.storage.local.set(data, function() {
            console.log(`Card name saved as: ${newName}`);
        });
        text.textContent = newName ? `(${newName})` : ''; // Update text with new name in parentheses if available
        text.style.display = 'inline'; // Show updated text
        editLink.style.display = 'inline'; // Show "Edit Name" link
        input.style.display = 'none'; // Hide input field
    });

    // Append input to the tooltip
    tooltip.appendChild(input);

    // Position the tooltip next to the numbers
    element.style.position = 'relative';
    element.appendChild(tooltip);
}

// Function to find credit card numbers and add tooltips
function addTooltipsToCards() {
    const cardElements = document.querySelectorAll('span[data-number]'); // Adjust this selector based on where Amazon shows the numbers
    cardElements?.forEach(element => {
        const lastFour = element.dataset.number;
        setCardAttribute(lastFour, element);
    });
}

function addTooltipToWallet() {
    const cardElements = document.querySelectorAll('.pmts-instrument-number-tail'); 
    cardElements?.forEach(element => {
        const text = element.textContent;
        const lastFour = text.match(/[0-9]{4}/)[0].trim(); // Regex to find last 4 digits with a preceding space
        console.log(lastFour);
        setCardAttribute(lastFour, element);
    });
}

function setCardAttribute(lastFour, element) {
    chrome.storage.local.get([lastFour], function (result) {
        const name = result[lastFour] || ""; // Default to empty string if no name
        createAlwaysVisibleTooltip(element, lastFour, name);
    });

    // Mark the div as having a tooltip
    element.setAttribute('data-tooltip-added', 'true');
}

function setAlias(){
    addTooltipToWallet();
    addTooltipsToCards();
}


// Run the function when the page loads
window.addEventListener('load', setAlias);
