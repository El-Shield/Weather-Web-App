// Function to fetch and parse CSV data
async function fetchCitiesData() {
    const response = await fetch('cities.csv');
    const csvData = await response.text();
    return csvData.split('\n');
}

// Function to update the dropdown list based on the current input value
async function updateDropdown(inputValue) {
    const cityDropdown = document.getElementById('city-dropdown');
    cityDropdown.innerHTML = ''; // Clear previous content

    // If the input value is empty, don't populate the dropdown
    if (!inputValue) {
        cityDropdown.style.display = 'none';
        return;
    }

    const cities = await fetchCitiesData();

    cities.forEach(cityCountry => {
        if (cityCountry.toLowerCase().includes(inputValue.toLowerCase())) {
            const option = document.createElement('div');
            option.textContent = cityCountry;
            option.addEventListener('click', () => {
                document.getElementById('city').value = cityCountry;
                cityDropdown.style.display = 'none';
            });
            cityDropdown.appendChild(option);
        }
    });

    if (cityDropdown.children.length === 0) {
        cityDropdown.innerHTML = '<div>No matching cities</div>';
    } 
    else {
        cityDropdown.style.display = 'block';
    }
}

// Add event listener to input field to trigger dropdown update
const cityInput = document.getElementById('city');
cityInput.addEventListener('input', () => {
    const inputValue = cityInput.value.trim();
    updateDropdown(inputValue);
});

// Update getWeather function to use entered city
function getWeather() {
    const apiKey = 'YOUR API KEY';
    const city = document.getElementById('city').value;

    if (!city) {
        alert('Please enter a city');
        return;
    }

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    // Fetch current weather data
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Display current weather data
            displayWeather(data);

            // Fetch hourly forecast data
            fetch(forecastUrl)
                .then(response => response.json())
                .then(data => {
                    // Display hourly forecast data
                    displayHourlyForecast(data.list);
                })
                .catch(error => {
                    console.error('Error fetching hourly forecast data:', error);
                    alert('Error fetching hourly forecast data. Please try again.');
                });
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            alert('Error fetching weather data. Please try again.');
        });
}

function displayWeather(data) {
    // Get DOM elements for displaying weather information
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');

    // Clear previous content
    weatherInfoDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    // Check if city not found
    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    } 
    else {
        // Extract relevant weather data
        const cityName = data.name;
        const temperature = Math.round(data.main.temp - 273.15); // Convert to Celsius
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        // Create HTML for temperature and weather description
        const temperatureHTML = `
            <p>${temperature}°C</p>
        `;
        const weatherHtml = `
            <p>${cityName}</p>
            <p>${description}</p>
        `;

        // Update DOM with weather information
        tempDivInfo.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHtml;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;

        // Show weather icon
        showImage();
    }
}

function displayHourlyForecast(hourlyData) {
    // Get DOM element for displaying hourly forecast
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    // Clear previous content
    hourlyForecastDiv.innerHTML = '';

    // Get forecast data for the next 8 hours
    const next8Hours = hourlyData.slice(0, 8); 

    // Loop through each forecast item and display it
    next8Hours.forEach(item => {
        // Extract relevant data for each hour
        const dateTime = new Date(item.dt * 1000); // Convert timestamp to milliseconds
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp - 273.15); // Convert to Celsius
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        // Create HTML for hourly forecast item
        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°C</span>
            </div>
        `;

        // Add hourly forecast item to the DOM
        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}

function showImage() {
    // Show weather icon
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block'; 
}
