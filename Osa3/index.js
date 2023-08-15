const express = require('express');
const app = express();
const PORT = 3001;

app.use(express.json());

let persons = [
  { id: 1, name: "Simo Sipuli", number: "123-4567" },
  { id: 2, name: "Pekka Porkkana", number: "234-5678" },
  { id: 3, name: "Rokka", number: "111-1111" },
  { id: 4, name: "Muumi", number: "123-4567" },
  { id: 5, name: "Kalapuikko", number: "234-5678" },
];

// Gets

app.get('/api/persons', (req, res) => {
    res.json(persons);
});

app.get('/api/info', (req, res) => {
    const currentDate = new Date();
    const infoMessage = `Phonebook has info for ${persons.length} people<br><br>${currentDate}`;
    res.send(infoMessage);
});

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(p => p.id === id);

    if (person) {
        res.json(person);
    } else {
        res.status(404).send({ error: 'Person not found' });
    }
});

// Add and delete

app.post('/api/persons', (req, res) => {
    const body = req.body;

    // Check if invalid input
    if (!body.name || !body.number) {
        return res.status(400).json({ 
            error: 'name or number missing' 
        });
    }

    // Check if already exists
    if (nameExists(body.name)) {
        return res.status(400).json({ 
            error: 'name must be unique' 
        });
    }

    const person = {
        name: body.name,
        number: body.number,
        // Generate a random ID
        id: Math.floor(Math.random() * 1000000),
    };

    console.log("Added person to "+person.name+" "+person.number+" "+person.id)

    persons.push(person);
    res.json(person);
});

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter(p => p.id !== id);

    res.status(204).end();
});

// Search functions

const nameExists = (name) => persons.some(person => person.name.toLowerCase() === name.toLowerCase());

// Start log

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});