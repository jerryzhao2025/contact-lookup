let contactData = [];

// --- CSV Parsing Function ---
// Converts raw CSV text into an array of JavaScript objects.
function csvToArray(text) {
    const lines = text.trim().split('\n');
    if (lines.length === 0) return [];
    
    // Extract headers from the first line and trim whitespace/quotes
    const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''));
    
    const result = [];
    
    // Process the rest of the lines (data)
    for (let i = 1; i < lines.length; i++) {
        const currentLine = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); // Split by comma, ignoring commas inside quotes
        const obj = {};
        
        // Map data fields to headers
        for (let j = 0; j < headers.length; j++) {
            // Clean up: trim whitespace and remove surrounding quotes
            const value = currentLine[j] ? currentLine[j].trim().replace(/^"|"$/g, '') : '';
            obj[headers[j]] = value;
        }
        result.push(obj);
    }
    return result;
}

// 1. Function to fetch and parse the CSV data
async function fetchData() {
    try {
        // Fetch the raw text content of the CSV file
        const response = await fetch('data.csv');
        const rawText = await response.text();
        
        // Convert the raw text to a searchable array of objects
        contactData = csvToArray(rawText);
        
    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('results-container').innerHTML = '<p>Error loading data. Please check your data.csv file.</p>';
    }
}

// 2. Function to perform the search and render results (UNMODIFIED)
function searchAndDisplay() {
    const inputElement = document.getElementById('search-input');
    const resultsContainer = document.getElementById('results-container');
    const searchTerm = inputElement.value.trim().toLowerCase();
    
    resultsContainer.innerHTML = ''; // Clear previous results

    if (searchTerm.length === 0) {
        resultsContainer.innerHTML = '<p>Start typing a last name to find a contact.</p>';
        return;
    }

    // Filter the data: Note: 'lastName' key must match the CSV header
    const matches = contactData.filter(contact => 
        contact.lastName.toLowerCase().includes(searchTerm)
    );

    if (matches.length > 0) {
        matches.forEach(contact => {
            const card = document.createElement('div');
            card.className = 'contact-card';
            card.innerHTML = `
                <h2><strong>First Name:</strong> ${contact.firstName}</h2>
                <p><strong>Last Name:</strong> ${contact.lastName}</p>
                <p><strong>Email:</strong> ${contact.email}</p>
                <p><strong>Preferred Phone:</strong> ${contact.preferredphone}</p>
            `;
            resultsContainer.appendChild(card);
        });
    } else {
        resultsContainer.innerHTML = `<p>No results found for "${searchTerm}".</p>`;
    }
}

// 3. Main execution: Load data and set up the search listener
fetchData().then(() => {
    document.getElementById('search-input').addEventListener('input', searchAndDisplay);
});
