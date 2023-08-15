import React, { useState, useEffect } from 'react';
import './index.css';
import axios from 'axios';

function App() {
  const [countries, setAllCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [displayCountry, setDisplayCountry] = useState('');
  const [weather, setWeather] = useState(null);

  const handleCountryClick = (country) => {
    console.log("Display "+country.name.common);
    setDisplayCountry(country);
    fetchWeather(country.capital)
    .then(response => {
      setWeather(response.data);
    })
    .catch(error => {
      console.error("Error fetching weather:", error);
    });
  };

  const handleBackClick = () => {
    console.log("List view")
    setDisplayCountry(null);
  };
  
  useEffect(() => {
    console.log("fetching countries");
  
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setAllCountries(response.data);
        //setFilteredCountries(response.data);
      })
      .catch(error => {
        console.error("Error fetching countries:", error);
      });
  
  }, []);
  
  useEffect(() => {
    console.log(countries.length+" "+filteredCountries.length);
    if(searchTerm.length == 0) return;
    const filtered = countries.filter(country => 
      country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCountries(filtered);
  }, [searchTerm, countries]);
  
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div>
      <h2>REST Countries</h2>
      <div>
        find countries <input value={searchTerm} onChange={handleSearchChange} />
      </div>
      {displayCountry ? (
        <div>
          <button onClick={handleBackClick}>Back to list</button>
          <CountryDisplay country={displayCountry} weather={weather} />
        </div>
      ) : (
        <CountryList countries={filteredCountries} onCountryClick={handleCountryClick} />
      )}
    </div>
  );
}

const CountryList = ({ countries, onCountryClick }) => {
  if(countries.length > 10) {
    //console.log("Countries:", countries.map(country => country.name.common).join(', '));  // For temporary debugging:
    return <p>Too many matches to display ({countries.length}).</p>;
  }

  if (countries.length == 0) return <p>No countries found.</p>;

  if (countries.length > 0) {
    //console.log("length: "+countries.length);
    return (
      <div>
        {countries.map(country => (
          <div key={country.alpha3Code} style={{ display: 'flex', alignItems: 'center' }}>
            <p style={{ marginRight: '10px' }}>{country.name.common}</p>
            <button onClick={() => onCountryClick(country)}>Show</button>
          </div>
        ))}

      </div>
    );
  }
  return null;
};

const apiKey = import.meta.env.VITE_SOME_KEY;

const CountryDisplay = ({country, weather }) => {
  return (
    <div>
      <h3>{country.name.common}</h3>
      <p>Capital: {country.capital}</p>
      <p>Population: {country.population}</p>
      <p>Languages: </p>
      <ul>
        {Object.values(country.languages).map(lang => <li key={lang}>{lang}</li>)}
      </ul>
      <img src={country.flags.png} alt={`Flag of ${country.name.common}`} width="150" />

      {weather != null && (
        <div>
          <h4>Weather in {country.capital}</h4>
          <p><strong>Temperature:</strong> {weather.main.temp}°C</p>
          <img src={`http://openweathermap.org/img/w/${weather.weather[0].icon}.png`} alt={weather.weather[0].description} />
          <p><strong>Wind:</strong> {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
    
  );
}

// Unable to test this code, as the API key returns 401 error. 
const fetchWeather = (capital) => {
  const apiKey = import.meta.env.VITE_SOME_KEY;
  const baseUrl = `http://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey.trim()}&units=metric`;

  return axios.get(baseUrl);
};

export default App;