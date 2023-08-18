const mongoose = require('../mongoConfig');

const nameValidation = { type: String, minlength: 3, maxlength:30, required: true }
const numberValidation = { type: String, minlength: 3, maxlength:20, required: true }

const phonebookSchema = new mongoose.Schema({
  name: nameValidation,
  number: numberValidation,
})

const Phonebook = mongoose.model('Phonebook', phonebookSchema)

module.exports = Phonebook