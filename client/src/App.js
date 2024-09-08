import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [gift, setGift] = useState('');
  const [loading, setLoading] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [sparkles, setSparkles] = useState([]);

  // Generate sparkle positions dynamically
  useEffect(() => {
    const generateSparkles = () => {
      const sparklesArray = [];
      for (let i = 0; i < 30; i++) {
        const cx = Math.random() * window.innerWidth; // Random X position
        const cy = Math.random() * window.innerHeight; // Random Y position
        const r = Math.random() * 4 + 1; // Random radius between 1 and 5
        const color = Math.random() > 0.5 ? 'gold' : '#fff'; // Alternate between gold and white
        const duration = Math.random() * 4 + 2; // Random animation duration between 2 and 6 seconds
        sparklesArray.push({ cx, cy, r, color, duration });
      }
      setSparkles(sparklesArray);
    };

    generateSparkles();
    window.addEventListener('resize', generateSparkles); // Regenerate on resize
    return () => window.removeEventListener('resize', generateSparkles);
  }, []);

  const handleGenerateGift = async () => {
    setLoading(true);
    setGift('');
    try {
      const response = await axios.get('api endpoint');
      setGift(response.data.gift);
    } catch (error) {
      setGift('Oops, something went wrong! Try again.');
    }
    setLoading(false);
  };

  const enableLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocationEnabled(true);
          try {
            const response = await axios.get(`api end point`);
          } catch (error) {
            console.error('Error fetching nearby stores:', error);
            alert('Error fetching nearby stores. Please try again.');
          }
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              alert('Location access denied. Please allow access to use this feature.');
              break;
            case error.POSITION_UNAVAILABLE:
              alert('Location information is unavailable. Try again later.');
              break;
            case error.TIMEOUT:
              alert('Request for location timed out. Please try again.');
              break;
            default:
              alert('An unknown error occurred. Please try again.');
          }
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  return (
    <div className="gift-background">
      {/* Dynamically render SVG sparkles */}
      <svg className="sparkles">
        {sparkles.map((sparkle, index) => (
          <circle
            key={index}
            cx={sparkle.cx}
            cy={sparkle.cy}
            r={sparkle.r}
            fill={sparkle.color}
            style={{ animationDuration: `${sparkle.duration}s` }}
          />
        ))}
      </svg>

      <div className="gift-box">
        <h1 className="title">🎁 Last-Minute Gift Generator 🎁</h1>

        <button className="generate-button" onClick={handleGenerateGift}>
          Generate Gift Idea
        </button>

        {loading && <div className="spinner"></div>}

        {gift && <p className="gift-display">{gift}</p>}

        {!locationEnabled && (
          <button className="location-button" onClick={enableLocation}>
            Enable Location
          </button>
        )}

        {locationEnabled && <p className="location-enabled">Location Enabled!</p>}
      </div>
    </div>
  );
}

export default App;
