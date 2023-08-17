const express = require('express');
const app = express();
require('./mongoConfig');
const Phonebook = require('./models/phonebook');

require('dotenv').config();

// Frontend build
app.use(express.static('build'));

// HUOMIO! app.usejen järjestyksellä on väliä!
app.use(express.json());

// Morgan

var morgan = require('morgan')
//app.use(morgan('tiny'));
morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

// Cors

const cors = require('cors')
app.use(cors())


//app.use(unknownEndpoint)
//app.use(requestLogger)

//let persons = [
//  { id: 1, name: "Simo Sipuli", number: "123-4567" },
//  { id: 2, name: "Pekka Porkkana", number: "234-5678" },
//  { id: 3, name: "Rokka", number: "111-1111" },
//  { id: 4, name: "Muumi", number: "123-4567" },
//  { id: 5, name: "Kalapuikko", number: "234-5678" },
//];

// Gets

app.get('/', function (req, res) {
    res.send('Greetings mortal.')
  })

app.get('/api/persons', (req, res) => {
    console.log("fetching phonebook")
    Phonebook.find({}).then(result => {
        res.json(result);
    })
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

app.get('*', (req, res) => { // Make the user go back to index.html if they attempt to access some not existing site
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

// Add, update and delete

app.post('/api/persons', (req, res) => {
    const body = req.body;
    console.log("Adding person "+body.name+" "+body.number);

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

    // console.log("Added person to "+person.name+" "+person.number+" "+person.id)

    const person = new Phonebook({
        name: body.name,
        number: body.number
    });

    person.save().then(savedPerson => {
        //res.json(savedPerson);
    });

    //persons.push(person);
    //res.json(person);
});

app.put('/api/persons/:id', (req, res) => { // Note to self: Put stands for update
    console.log(`Received PUT request for ID: ${req.params.id}`);
    const id = req.params.id;
    const body = req.body;

    if (!id || id === 'undefined') return res.status(400).json({ error: 'Invalid or missing ID' });

    const updatedPerson = {
        name: body.name,
        number: body.number
    };

    Phonebook.findByIdAndUpdate(id, updatedPerson, { new: true })
        .then(updatedPerson => {
            res.json(updatedPerson);
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Something went wrong, person could not be updated' });
        });
});


app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    console.log("Attempting to delete ID: "+id);

    if (!id || id === 'undefined') return res.status(400).json({ error: 'Invalid or missing ID' });
    
    Phonebook.findByIdAndRemove(id)
        .then(result => {
            if (result) {
                res.status(204).end();
            } else {
                res.status(404).json({ error: 'Person not found' });
            }
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Something went wrong' });
        });
});

// Search functions

const nameExists = (name) => persons.some(person => person.name.toLowerCase() === name.toLowerCase());

// Other functions

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
  }

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }

// Start

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});