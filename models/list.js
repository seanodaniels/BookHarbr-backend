const mongoose = require('mongoose')

const listsSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
    cast: false
  },
  listName: {
    type: String,
    minLength: 3,
    required: true,
    cast: false
  },
  bookKeys: {
    type: [String], // Work key from openlibrary.org
    required: true,
    cast: false, // Irrelevant setting, as empty arrays are cast as type Mixed anyway.
    default: undefined, // Override: Arrays implicitly have a value of [] by default. 
  },
})

listsSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('List', listsSchema)