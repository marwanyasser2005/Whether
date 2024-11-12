const apiKey = 'a962a0752e4c1582cbc6f82b32149a0c';  // Your OpenWeatherMap API key
const baseURL = 'https://api.openweathermap.org/data/2.5/weather?zip=';

// Helper function to get the current date in MM.DD.YYYY format
const getCurrentDate = () => {
  const date = new Date();
  return `${date.getMonth() + 1}.${date.getDate()}.${date.getFullYear()}`;
};

// Event listener for the 'Generate' button
document.getElementById('generate').addEventListener('click', handleGenerateButtonClick);

// Handle 'Generate' button click
async function handleGenerateButtonClick() {
  const zipCode = document.getElementById('zip').value.trim();
  const feelings = document.getElementById('feelings').value.trim();

  // Check if the zip code is provided
  if (!zipCode) {
    alert('Please enter a valid zip code.');
    return;
  }

  try {
    const weatherData = await getWeatherData(zipCode);

    // Check if weather data is fetched successfully
    if (weatherData) {
      // Post the data to the server
      await postData('/addWeather', {
        temperature: weatherData.main.temp,
        date: getCurrentDate(),
        userResponse: feelings,
      });
      // Update the UI with the latest data
      await updateUI();
    } else {
      alert('Unable to fetch weather data. Please check the zip code and try again.');
    }
  } catch (error) {
    console.error('Error handling Generate button click:', error);
    alert('Something went wrong. Please try again later.');
  }
}

// Fetch weather data from OpenWeatherMap API
const getWeatherData = async (zipCode) => {
  try {
    // Construct the full URL for the API request
    const url = `${baseURL}${zipCode}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    
    // Check if the response is OK (status 200)
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    // Return the weather data in JSON format
    return await response.json();
  } catch (error) {
    console.error('Error fetching weather data:', error);
    alert('Failed to fetch weather data. Please check your internet connection and try again.');
  }
};

// Post data to the server
const postData = async (url = '', data = {}) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    // Check if the response is OK (status 200)
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    // Return the JSON response from the server
    return await response.json();
  } catch (error) {
    console.error('Error posting data:', error);
    alert('Failed to save your data. Please try again later.');
  }
};

// Update the UI with fetched data
const updateUI = async () => {
  try {
    const request = await fetch('/getWeather');

    // Check if the request is successful (status 200)
    if (!request.ok) {
      throw new Error(`Error: ${request.status} - ${request.statusText}`);
    }
    
    // Retrieve and update the UI with the weather data
    const allData = await request.json();
    document.getElementById('date').innerText = `${allData.date}`;
    document.getElementById('temp').innerText = `${allData.temperature}°C`;
    document.getElementById('content').innerText = `${allData.userResponse}`;
    document.getElementById('entryHolder').style.display = 'block'; // Show entry holder section
  } catch (error) {
    console.error('Error updating UI:', error);
    alert('Failed to update the UI. Please try again later.');
  }
};
