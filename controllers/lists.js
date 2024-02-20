const listsRouter = require('express').Router()
const List = require('../models/List')

const currentUserId = '65c88888888888888888887f' // dummy user. change this when authentication

listsRouter.get('/', async (request, response) => {
  const lists = await List.find({})
  response.status(201).json(lists)
})

listsRouter.get('/:id', async (request, response, next) => {
  const list = await List.findById(request.params.id)
  if (list) {
    response.json(list)
  } else {
    response.status(404).end()
  }
})

listsRouter.delete('/:id', async (request, response) => {
  await List.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

listsRouter.post('/', async (request, response, next) => {
  const body = request.body

  const list = new List({
    user: currentUserId,
    listName: body.listName,
    bookKeys: body.bookKeys
  })

  const savedList = await list.save()
  response.status(201).json(savedList)

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


module.exports = listsRouter