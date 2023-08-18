const mongoose = require('../mongoConfig');

const nameValidation = { type: String, minlength: 3, maxlength:30, required: true }
const numberValidation = { type: String, minlength: 8, required: true }

const phonebookSchema = new mongoose.Schema({
  name: nameValidation,
  number: {
    ...numberValidation,
    validate: {
      validator: function(v) {
        const parts = v.split('-');
    
        if (parts.length !== 2) return false;
        
        const firstPartIsValid = parts[0].length === 2 || parts[0].length === 3;
        const secondPartIsValid = parts[1].length >= 5 && parts[1].length <= 15;
    
        // Check that both parts are valid, else it's just invalid.
        return firstPartIsValid && secondPartIsValid;
    },
      message: props => `${props.value} is not a valid phone number!`
    }
  }
});

//const phonebookSchema = new mongoose.Schema({
//  name: nameValidation,
//  number: numberValidation,
//})

const Phonebook = mongoose.model('Phonebook', phonebookSchema)

module.exports = Phonebook