// getfunctions.js

async function fetchDrivers() {
    try {
        const response = await fetch('http://localhost:3000/api/drivers');
        const data = await response.json();

        // Select the scroll-box where the driver list will be displayed
        const scrollBox = document.getElementById('scroll-box');

        // Clear the scroll-box before appending new content (in case there is existing content)
        scrollBox.innerHTML = '';

        // Loop through the data and create a list of driver names
        data.forEach(driver => {
            const driverElement = document.createElement('p');
            driverElement.textContent = `${driver.forename} ${driver.surname}`;
            scrollBox.appendChild(driverElement); // Append each driver to the scroll-box
        });
    } catch (error) {
        console.error("Error fetching drivers:", error);
    }
}
