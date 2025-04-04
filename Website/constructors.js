async function fetchDrivers() {
    try {
        const response = await fetch('http://localhost:3000/api/constructors');
        const data = await response.json();

        // Select the scroll-box where the driver list will be displayed
        const scrollBox = document.getElementById('scroll-box');

        // Clear previous content before appending new data
        scrollBox.innerHTML = '';

        // Loop through the data and create a list of clickable driver names
        data.forEach(constructor => {
            const driverElement = document.createElement('p');
            driverElement.textContent = `${constructor.name}`;
            driverElement.classList.add('driver-name'); // Add a class for styling

            // Add click event listener to output driverID
            driverElement.addEventListener('click', () => {
                setDrivers(constructor.constructorId);
                fetchWikipediaDataFromURL(constructor.url); // Use stored Wikipedia link
            });

            scrollBox.appendChild(driverElement); // Append each driver to the scroll-box
        });
    } catch (error) {
        console.error("Error fetching drivers:", error);
    }
}

async function setDrivers(constructorID) {
    try {
        // Ensure driverID is a valid number
        const idToFind = Number(constructorId);
        if (isNaN(idToFind)) {
            console.error("Invalid driver ID:", constructorID);
            return;
        }

        const response = await fetch('http://localhost:3000/api/constructors');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();

        // Find the driver
        const constructor = data.find(d => Number(d.constructorId) === idToFind);


        if (!constructor) {
            console.error(`Driver with ID ${idToFind} not found.`);
            return;
        }


        // Get elements and update values
        document.getElementById('Dname').textContent = `${constructor.name}` || "N/A";
        document.getElementById('Dnationality').textContent = constructor.nationality || "N/A";
        document.getElementById('Drdescription').textContent = constructor.description || "N/A";

        console.log("Driver info updated:", constructor);
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





