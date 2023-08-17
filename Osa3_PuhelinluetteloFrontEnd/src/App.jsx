import React, { useState, useEffect } from 'react';
import './index.css'
import axios from 'axios';
import phonebookService from './services/phonebook';

const baseUrl = phonebookService.baseUrl;

function App() {
  const [persons, setPersons] = useState([]);

  useEffect(() => {
    phonebookService.getAll()
      .then(response => {
        console.log("Fetch data from phonebook service");
        setPersons(response.data);
      })
  }, []);

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState({message: null, type: null});

  const handleSearchChange = (event) => setSearchTerm(event.target.value);
  const handleNameChange = (event) => setNewName(event.target.value);
  const handleNumberChange = (event) => setNewNumber(event.target.value);

  const handleSubmit = (event) => {
    event.preventDefault();

    let personExists = persons.some(person => person.name === newName);

    if (personExists) {
      const isConfirmed = window.confirm(`${newName} is already in the phonebook, replace phonenumber?`);

      personExists = persons.find(p => p.name === newName);

      if(isConfirmed) {
        const updatedPerson = { ...personExists, number: newNumber };
        phonebookService.url
        axios.put(baseUrl+`${personExists.id}`, updatedPerson)
        .then(response => {
          setPersons(persons.map(p => p.id !== personExists.id ? p : response.data));
          showNotification(`Added new number (${newNumber}) to ${newName}`, 'success');
        })
        .catch(error => {
          console.error("Error updating person:", error);
          showNotification(`Couldn't update number of ${newName}! This name may no longer exist.`, 'error');
        });
      }
    }
    else { // --- New person ---
      const newPerson = { name: newName, number: newNumber };

      console.log("Trying to add person to url: "+baseUrl)
      axios.post(baseUrl, newPerson)
        .then(response => {
          setPersons(persons.concat(response.data));
          setNewName('');
          setNewNumber('');
          showNotification(`Added ${newName}`, 'success');
        })
        .catch(error => {
          console.error("Error: Failed to add person! ", error);

          const errorMessage = error.response && error.response.data.error 
          ? error.response.data.error // Get the error from backend and display inside notification.
          : `Couldn't add ${newName}`;
          showNotification(errorMessage, 'error');
        });
      }
    }

    const handleDelete = (id) => {
      console.log("Attempting to delete id on front: "+id);
      const personToDelete = persons.find(p => p.id === id);
      if (window.confirm(`Delete ${personToDelete.name}?`)) {
        phonebookService.remove(id)
          .then(() => {
            setPersons(persons.filter(p => p.id !== id));
            showNotification(`Deleted ${personToDelete.name}`, 'success');
          })
          .catch(error => {
            console.error("Error: Failed to delete person! ", error);
            showNotification(`Couldn't delete person ${personToDelete.name}`, 'error');
      });
    }
  }

  const showNotification = (message, type = 'success') => {
    console.log(message+" "+type);

    if(type != 'success') message = "ERROR! "+message;
    
    setNotification({ message: message, type: type });

    setTimeout(() => {
      setNotification({message: null, type: null});
    }, 5000); // This will clear the notification after 5 seconds
  }  

  const filteredPersons = persons.filter(person => 
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>

      {notification.message && 
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      }

      <FilterForm searchTerm={searchTerm} handleSearchChange={handleSearchChange} />
      <NewPersonForm 
        handleSubmit={handleSubmit} 
        newName={newName} 
        handleNameChange={handleNameChange} 
        newNumber={newNumber} 
        handleNumberChange={handleNumberChange} 
      />

      <h2>Numbers</h2>
      <Persons persons={filteredPersons} handleDelete={handleDelete} />


    </div>
  )
}

const FilterForm = ({ searchTerm, handleSearchChange }) => {
  return (
    <div>
      filter shown with: <input value={searchTerm} onChange={handleSearchChange} />
    </div>
  );
}

const NewPersonForm = ({ handleSubmit, newName, handleNameChange, newNumber, handleNumberChange }) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
}

const Person = ({ person, handleDelete }) => {
  return (
    <p>
      {person.name} / {person.number}
      <button onClick={() => handleDelete(person.id)}>Delete</button>
    </p>
  );
}

const Persons = ({ persons, handleDelete }) => {
  return (
    <div>
      {persons.map(person => <Person key={person.name} person={person} handleDelete={handleDelete} />)}
    </div>
  );
}

export default App;