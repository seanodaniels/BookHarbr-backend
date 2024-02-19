const booksRouter = require('express').Router()
const Book = require('../models/book')

// Example Entries
// {
//   "key": "/works/OL17363125W",
//   "title": "The Fifth Season",
//   "author_name": [
//     "N. K. Jemisin"
//   ],
// },
// {
//   "key": "/works/OL17877492W",
//   "title": "The Traitor Baru Cormorant (Baru Cormorant #1)",
//   "author_name": [
//     "Seth Dickinson"
//   ],
// },
// {
//   "key": "/works/OL20086330W",
//   "title": "How to Be an Antiracist",
//   "author_name": [
//     "Ibram X. Kendi"
//   ],
// },

booksRouter.get('/', (request, response) => {
  Book.find({}).then(books => {
    response.json(books)
  })
})

booksRouter.get('/:id', (request, response, next) => {
  Book.findById(request.params.id).then(book => {
    if (book) {
      response.json(book)
    } else {
      console.log('ERROR: 404 Not Found')
      response.status(404).end()
    }
  })
    .catch(error => next(error))
})

booksRouter.post('/', (request, response, next) => {
  const body = request.body
  const book = new Book({
    key: body.key,
    title: body.title,
    author_name: body.author_name
  })

  book.save().then(savedBook => {
    response.json(savedBook)
  })
    .catch(error => next(error))
})

booksRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const book = {
    key: body.key,
    title: body.title,
    author_name: [body.author_name]
  }

  Book.findByIdAndUpdate(request.params.id, book, { new: true })
    .then(updatedBook => {
      response.json(updatedBook)
    })
    .catch(error => next(error))
})

booksRouter.delete('/:id', (request, response, next) => {
  // books = books.filter(book => book.id !== id)
  // response.status(204).end()
  Book.findByIdAndDelete(request.params.id)
    .then(result => {
      console.log(`DELETED record id ${request.params.id}`)
      response.status(204).end()
    })
    .catch(error => next(error))
})

module.exports = booksRouter