import React, { useEffect, useState } from 'react';  // Added useState
import './App.css';

function App() {
  const [locationError, setLocationError] = useState(null);  // for location error
  const [stores, setStores] = useState([]);  //  store fetched stores

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        console.log('Latitude:', latitude, 'Longitude:', longitude);
        
        // fetching nearby stores based on location of user
        fetchNearbyStores(latitude, longitude).then(stores => {
          console.log('Nearby stores:', stores);  // for back end chatgpt integration
          setStores(stores);  // Save stores to state
        }).catch(err => {
          console.log('Error fetching stores:', err);  // added error handling for fetching stores
          setLocationError('Error fetching nearby stores.');
        });
      },
      error => {
        console.log('Error getting location', error);
        setLocationError('Error getting location: ' + error.message);  //  location error state
      }
    );
  }, []);
  
  // function to fetch nearby stores from Google Places API
  const fetchNearbyStores = async (latitude, longitude) => {
    const apiKey = "AIzaSyAGoBZwIIAx5x7Wp_Vqt8nsrf946rwze6k";  // rowdy's api key
    const radius = 5000;  // meters radius for search
  
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=store&key=${apiKey}`;
  
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch stores');  // added error handling for fetch failure
      const data = await response.json();
      return data.results;  // returning the fetched store data
    } catch (error) {
      console.error('Error fetching nearby stores:', error);
      throw error;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Last-Minute Gift Generator</h1>
        {locationError ? (
          <p>{locationError}</p>  // Display location error if it occurs
        ) : (
          <p>Fetching your location and nearby stores...</p>
        )}
        {stores.length > 0 && (
          <ul>
            {stores.map(store => (
              <li key={store.place_id}>{store.name}</li>  // Display store names
            ))}
          </ul>
        )}
      </header>
    </div>
  );
}

export default App;
