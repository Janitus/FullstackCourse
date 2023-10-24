const mongoose = require('mongoose');


const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: { type: Number, default: 0 },  
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
});

/* https://fullstackopen.com/osa3/tietojen_tallettaminen_mongo_db_tietokantaan#tietokantaa-kayttava-backend
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
*/

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
