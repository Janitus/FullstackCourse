const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')

  Phonebook.find({}).then(result => {
    result.forEach(phonebook => {
      console.log(phonebook)
    })
    mongoose.connection.close()
  })

  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://jankuul:${password}@cluster0.it26as1.mongodb.net/noteApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Phonebook = mongoose.model('Phonebook', phonebookSchema)

if (process.argv.length === 5) {
  const name = process.argv[3]
  const number = process.argv[4]

  const entry = new Phonebook({
    name: name,
    number: number,
  })

  entry.save().then(result => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
} else if (process.argv.length === 3) {
  Phonebook.find({}).then(entries => {
    console.log('phonebook:')
    entries.forEach(entry => {
      console.log(`${entry.name} ${entry.number}`)
    })
    mongoose.connection.close()
  })
} else {
  console.log('Please provide the correct arguments.')
  mongoose.connection.close()
}