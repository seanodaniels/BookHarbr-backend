const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
  key: String,
  title: {
    type: String,
    minLength: 1,
    required: true,
    cast: false
  },
  author_name: {
    type: [String],
    required: true,
    cast: false, // Irrelevant setting, as empty arrays are cast as type Mixed anyway.
    default: undefined, // Override: Arrays implicitly have a value of [] by default. 
    // validate: arrayMin
  },
})

bookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Book', bookSchema)