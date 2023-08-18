const express = require('express');
const app = express();
require('./mongoConfig');
const Phonebook = require('./models/phonebook');
require('dotenv').config();
app.use(express.static('build')); // frontendin buildaus
app.use(express.json());

// Morgan
var morgan = require('morgan')
morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

// Cors
const cors = require('cors')
app.use(cors())

// Gets

app.get('/', function (req, res) {
    res.send('Greetings mortal.')
});

app.get('/api/persons', (req, res, next) => {
    console.log("fetching phonebook");
    Phonebook.find({})
        .then(result => {
            res.json(result);
        })
        .catch(error => next(error));
});

app.get('/api/info', (req, res, next) => {
    Phonebook.countDocuments({}, (err, count) => {
        if (err) {
            next(err);
        } else {
            const currentDate = new Date();
            const infoMessage = `Phonebook has info for ${count} people<br><br>${currentDate}`;
            res.send(infoMessage);
        }
    });
});

app.get('/api/persons/:id', (req, res, next) => {
    Phonebook.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person);
            } else {
                res.status(404).send({ error: 'Person not found' });
            }
        })
        .catch(error => next(error));
});

app.get('*', (req, res) => { // Make the user go back to index.html if they attempt to access some not existing site
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

// Add, update and delete

app.post('/api/persons', async (req, res, next) => {
    const body = req.body;
    console.log("Adding person " + body.name + " " + body.number);

    if (body.content === undefined) return res.status(400).json({ error: 'content missing' }) // Not sure I need this either

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'name or number missing'
        });
    }

    const exists = await nameExists(body.name);
    if (exists) {
        const personToUpdate = await Phonebook.findOne({ name: body.name }); // Not sure if I should change this by ID but w/e
        personToUpdate.number = body.number;
        const updatedPerson = await personToUpdate.save();
        return res.json(updatedPerson);
        
        //return res.status(400).json({
        //    error: 'name must be unique'
        //});
    }

    const person = new Phonebook({
        name: body.name,
        number: body.number
    });

    person.save()
        .then(savedPerson => {
            res.json(savedPerson);
        })
        .catch(error => next(error));
});


app.put('/api/persons/:id', (req, res, next) => {
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
        .catch(error => next(error));
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
        .catch(error => next(error));
});

// Search functions

const nameExists = async (name) => {
    const person = await Phonebook.findOne({ name: name });
    if (person) {
        return true;
    } else {
        return false;
    }
};

// Other functions

const requestLogger = (request, response, next) => {
    console.log('RL ---- ');

    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next();
}



const unknownEndpoint = (request, response) => {
    const error = new Error('Unknown endpoint');
    error.status = 404;

    next(error);
}



const errorHandler = (error, request, response, next) => {
    console.error("EH: "+error.message)

    if (error.name === 'CastError')                 return response.status(400).send({ error: 'malformatted id' });
    else if (error.name === 'ValidationError')      return response.status(400).json({ error: error.message });
    else if (error.status === 404)                  return response.status(404).send({ error: 'unknown endpoint' });
    else                                            return response.status(500).send({ error: 'An unexpected error occurred' });

    next(error) // Never reached atm!
}

app.use(requestLogger);
app.use(unknownEndpoint)
app.use(errorHandler)

// Start

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});