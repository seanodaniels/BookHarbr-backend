require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Book = require('./models/book')


let books = [
  {
    id: 1,
    key: '/works/OL17363125W',
    title: 'The Fifth Season',
    author_name: [
      'N. K. Jemisin'
    ],
  },
  {
    id: 2,
    key: '/works/OL17877492W',
    title: 'The Traitor Baru Cormorant (Baru Cormorant #1)',
    author_name: [
      'Seth Dickinson'
    ],
  },
  {
    id: 3,
    key: '/works/OL20086330W',
    title: 'How to Be an Antiracist',
    author_name: [
      'Ibram X. Kendi'
    ],
  },
]



const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(cors())
app.use(express.json())
app.use(requestLogger)

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/books', (request, response) => {
  Book.find({}).then(b => {
    response.json(b)
  })
  // response.json(books)
})

const generateId = () => {
  const maxId = books.length > 0
    ? Math.max(...books.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/books', (request, response) => {
  const body = request.body

  if (!body.title) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const book = new Book({
    key: body.key,
    title: body.title,
    author_name: [body.author_name]
  })

  // books = books.concat(book)

  book.save().then(savedBook => {
    response.json(savedBook)
  })
})

app.get('/api/books/:id', (request, response) => {
  Book.findById(request.params.id).then(b => {
    if (b) {
      response.json(b)
    } else {
      console.log('ERROR: 404 Not Found')
      response.status(404).end()
    }
  })
    .catch(error => {
      console.log('ERROR:', error)
      response.status(400).send({ error: 'Malformed ID' })
    })
})

app.delete('/api/books/:id', (request, response) => {
  const id = Number(request.params.id)
  books = books.filter(book => book.id !== id)

  response.status(204).end()
})

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})