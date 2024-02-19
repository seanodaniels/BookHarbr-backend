const listsRouter = require('express').Router()
const List = require('../models/List')

const currentUserId = '65c88888888888888888887f' // dummy user. change this when authentication

listsRouter.get('/', (request, response) => {
  List.find({}).then(books => {
    response.json(books)
  })
})

listsRouter.get('/:id', (request, response, next) => {
  List.findById(request.params.id).then(list => {
    if (list) {
      response.json(book)
    } else {
      console.log('ERROR: 404 Not Found')
      response.status(404).end()
    }
  })
    .catch(error => next(error))
})

listsRouter.post('/', (request, response, next) => {
  const body = request.body
  const list = new List({
    user: currentUserId,
    listName: body.listName,
    bookKeys: body.bookKeys
  })

  list.save().then(savedList => {
    response.json(savedList)
  })
    .catch(error => next(error))
})

listsRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const list = {
    user: body.userId,
    listName: body.listName,
    bookKeys: body.bookKeys
  }

  List.findByIdAndUpdate(request.params.id, list, { new: true })
    .then(updateList => {
      response.json(updateList)
    })
    .catch(error => next(error))
})

listsRouter.delete('/:id', (request, response, next) => {
  List.findByIdAndDelete(request.params.id)
    .then(result => {
      console.log(`DELETED record id ${request.params.id}`)
      response.status(204).end()
    })
    .catch(error => next(error))
})

module.exports = listsRouter