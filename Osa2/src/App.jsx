import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event) => setSearchTerm(event.target.value);
  const handleNameChange = (event) => setNewName(event.target.value);
  const handleNumberChange = (event) => setNewNumber(event.target.value);

  const handleSubmit = (event) => {
    event.preventDefault();

    const nameExists = persons.some(person => person.name === newName);

    if (nameExists) {
      alert(`${newName} is already added to phonebook`);
    } else {
      setPersons(persons.concat({ name: newName, number: newNumber }));
      setNewName('');
      setNewNumber('');
    }
  }

  const filteredPersons = persons.filter(person => 
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>

      <FilterForm searchTerm={searchTerm} handleSearchChange={handleSearchChange} />
      <NewPersonForm 
        handleSubmit={handleSubmit} 
        newName={newName} 
        handleNameChange={handleNameChange} 
        newNumber={newNumber} 
        handleNumberChange={handleNumberChange} 
      />

      <h2>Numbers</h2>
      <Persons persons={filteredPersons} />

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

const Person = ({ person }) => {
  return (
    <p>{person.name} {person.number}</p>
  );
}

const Persons = ({ persons }) => {
  return (
    <div>
      {persons.map(person => <Person key={person.name} person={person} />)}
    </div>
  );
}



export default App;
