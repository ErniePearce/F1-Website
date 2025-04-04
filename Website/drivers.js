async function fetchDrivers() {
    try {
        const response = await fetch('http://localhost:3000/api/drivers');
        const data = await response.json();

        // Select the scroll-box where the driver list will be displayed
        const scrollBox = document.getElementById('scroll-box');

        // Clear previous content before appending new data
        scrollBox.innerHTML = '';

        // Loop through the data and create a list of clickable driver names
        data.forEach(driver => {
            const driverElement = document.createElement('p');
            driverElement.textContent = `${driver.forename} ${driver.surname}`;
            driverElement.classList.add('driver-name'); // Add a class for styling

            // Add click event listener to output driverID
            driverElement.addEventListener('click', () => {
                setDrivers(driver.driverId);
                fetchWikipediaDataFromURL(driver.url); // Use stored Wikipedia link
            });

            scrollBox.appendChild(driverElement); // Append each driver to the scroll-box
        });
    } catch (error) {
        console.error("Error fetching drivers:", error);
    }
}

async function setDrivers(driverID) {
    try {
        // Ensure driverID is a valid number
        const idToFind = Number(driverID);
        if (isNaN(idToFind)) {
            console.error("Invalid driver ID:", driverID);
            return;
        }

        const response = await fetch('http://localhost:3000/api/drivers');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();

        // Find the driver
        const driver = data.find(d => Number(d.driverId) === idToFind);


        if (!driver) {
            console.error(`Driver with ID ${idToFind} not found.`);
            return;
        }


        // Get elements and update values
        document.getElementById('Dname').textContent = `${driver.forename} ${driver.surname}` || "N/A";
        document.getElementById('Dnationality').textContent = driver.nationality || "N/A";
        document.getElementById('Drdob').textContent = driver.dob || "N/A";
        document.getElementById('Dteam').textContent = driver.team || "N/A";
        document.getElementById('Drdescription').textContent = driver.description || "N/A";

        console.log("Driver info updated:", driver);
    } catch (error) {
        console.error("Error fetching drivers:", error);
    }
}



async function fetchWikipediaDataFromURL(wikiURL) {
    try {
        // Extract the Wikipedia page title from the URL
        const pageTitle = wikiURL.split("/wiki/")[1];

        if (!pageTitle) {
            console.error("Invalid Wikipedia URL");
            return;
        }

        // Wikipedia API URL to get introduction and image
        const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&titles=${pageTitle}&prop=extracts|pageimages&exintro=true&explaintext=true&pithumbsize=500`;

        const response = await fetch(apiUrl);
        const data = await response.json();

        // Extract page data
        const pages = data.query.pages;
        const page = Object.values(pages)[0];

        if (page.missing) {
            console.warn(`Wikipedia page not found for ${pageTitle}`);
            return;
        }

        const introText = page.extract || "No introduction available.";
        const imageUrl = page.thumbnail ? page.thumbnail.source : "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"; // Default image

        console.log("Introduction:", introText);
        console.log("Image URL:", imageUrl);

        // Display the fetched data on the webpage
        document.getElementById("Drdescription").textContent = introText;
        document.getElementById("driver-img").src = imageUrl;
    } catch (error) {
        console.error("Error fetching Wikipedia data:", error);
    }
}





