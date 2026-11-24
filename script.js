// STEP 1: Get HTML elements
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const clearButton =document.getElementById("clearButton");
const results = document.getElementById("results");

// STEP 2: Create a demonstration patent dataset
const patentDatabase = [
    {
        title: "Smart Irrigation System",
        description: "An automated irrigation system using soil moisture sensors to control water supply.",
        keywords: ["smart", "irrigation", "soil", "moisture", "sensor", "water"]
    },
    {
        title: "Automatic Plant Watering Device",
        description: "A device that automatically waters plants based on soil moisture measurements.",
        keywords: ["automatic", "plant", "watering", "soil", "moisture", "sensor"]
    },
    {
        title: "Solar Powered Water Pump",
        description: "A solar energy based pump designed to supply water to agricultural fields.",
        keywords: ["solar", "water", "pump", "agriculture", "energy"]
    },
    {
        title: "IoT Based Agriculture Monitoring",
        description: "An agriculture monitoring system using sensors and Internet of Things technology.",
        keywords: ["iot", "agriculture", "monitoring", "sensor", "smart"]
    },
    {
        title: "Automatic Drip Irrigation",
        description: "A drip irrigation system that controls water distribution to crops.",
        keywords: ["automatic", "drip", "irrigation", "water", "crops"]
    }
];

// STEP 3: List of common words to ignore
const commonWords = [
    "the", "is", "a", "an", "and", "or", "of",
    "to", "for", "with", "using", "based", "in"
];

// STEP 4: Convert the search text into keywords
function getKeywords(text) {

    const words = text.toLowerCase().match(/[a-z0-9]+/g) || [];

    return [...new Set(
        words.filter(word =>
            word.length > 1 && !commonWords.includes(word)
        )
    )];
}

// STEP 5: Calculate similarity score
function calculateSimilarity(searchKeywords, patentKeywords) {

    if (searchKeywords.length === 0) {
        return 0;
    }

    let matchedWords = 0;

    searchKeywords.forEach(word => {

        if (patentKeywords.includes(word)) {
            matchedWords++;
        }

    });

    const score = (matchedWords / searchKeywords.length) * 100;

    return Math.round(score);
}

// STEP 6: Search when the button is clicked
searchButton.addEventListener("click", function() {

    const searchText = searchInput.value.trim();

    if (searchText === "") {

        results.textContent = "Please enter an invention idea first.";

        return;
    }

    const searchKeywords = getKeywords(searchText);

    if (searchKeywords.length === 0) {

        results.textContent = "Please enter a more descriptive invention idea.";

        return;
    }

    // STEP 7: Compare the search with every demonstration record
    const matchedPatents = patentDatabase.map(patent => {

        const score = calculateSimilarity(
            searchKeywords,
            patent.keywords
        );

        return {
            ...patent,
            score: score
        };

    });

    // STEP 8: Arrange results from highest score to lowest
    matchedPatents.sort((a, b) => b.score - a.score);

    // STEP 9: Clear old results
    results.replaceChildren();

    // STEP 10: Display the search heading
    const heading = document.createElement("h3");
    heading.textContent = "Prior-Art Similarity Analysis";

    results.appendChild(heading);

    // Display extracted keywords
    const keywordText = document.createElement("p");
    keywordText.textContent =
        "Extracted keywords: " + searchKeywords.join(", ");

    results.appendChild(keywordText);

    // Clearly identify the demonstration dataset
    const notice = document.createElement("p");
    notice.textContent =
        "Note: The following are illustrative demonstration records, not verified patent documents.";

    results.appendChild(notice);

    // STEP 11: Display matching records
    matchedPatents.forEach(patent => {

        if (patent.score === 0) {
            return;
        }

        const card = document.createElement("div");
        card.className="patent-card";

        const title = document.createElement("h4");
        title.textContent = patent.title;

        const description = document.createElement("p");
        description.textContent = patent.description;

        const scoreText = document.createElement("p");
        scoreText.textContent =
            "Keyword similarity: " + patent.score + "%";
            scoreText.className = "similarity-score";

// Create a progress bar container
const progressContainer = document.createElement("div");
progressContainer.className = "progress-container";

// Create the progress bar
const progressBar = document.createElement("div");
progressBar.className = "progress-bar";

// Set the width according to similarity
progressBar.style.width = patent.score + "%";

// Add the progress bar inside its container
progressContainer.appendChild(progressBar);

        card.appendChild(title);
        card.appendChild(description);
        card.appendChild(scoreText);
        card.appendChild(progressContainer);

        results.appendChild(card);

    });

    // STEP 12: Display real patent search sources

const searchURL =
    "https://patents.google.com/?q=" +
    encodeURIComponent(searchText);

// Create a section for external patent sources
const sourceSection = document.createElement("div");
sourceSection.className = "external-sources";

// Create a heading
const sourceHeading = document.createElement("h3");
sourceHeading.textContent = "Explore Real Patent Databases";

// Create an explanation
const sourceMessage = document.createElement("p");
sourceMessage.textContent =
    "Continue your prior-art search using official patent search resources.";

// Google Patents link
const googleLink = document.createElement("a");
googleLink.href = searchURL;
googleLink.target = "_blank";
googleLink.rel = "noopener noreferrer";
googleLink.textContent = "Search on Google Patents";
googleLink.className = "source-link";

// Espacenet link
const espacenetLink = document.createElement("a");
espacenetLink.href = "https://worldwide.espacenet.com/";
espacenetLink.target = "_blank";
espacenetLink.rel = "noopener noreferrer";
espacenetLink.textContent = "Explore EPO Espacenet";
espacenetLink.className = "source-link";

// Add everything to the source section
sourceSection.appendChild(sourceHeading);
sourceSection.appendChild(sourceMessage);
sourceSection.appendChild(googleLink);
sourceSection.appendChild(document.createElement("br"));
sourceSection.appendChild(espacenetLink);

// Display the section
results.appendChild(sourceSection);

});

clearButton.addEventListener("click", function () {

    searchInput.value = "";

    results.innerHTML = "";

    const message = document.createElement("p");
    message.textContent = "Your search results will appear here.";

    results.appendChild(message);

    searchInput.focus();

});