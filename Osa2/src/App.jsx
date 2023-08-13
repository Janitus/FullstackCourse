import React, { useState, useEffect } from 'react';
import axios from 'axios';

function useTestEffect() {
  useEffect(() => {
    console.log("Effect has been run");
  }, []);
}

const App = () => {
  // Call the custom hook
  useTestEffect();

  /*
  const [persons, setPersons] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data);
      })
  }, []);
  */
  return (
    <div>
      <h2>Phonebook</h2>
      {/* {persons.map(person => 
        <div key={person.id}>
          {person.name} {person.number}
        </div>
      )} */}
    </div>
  )
}

export default App;