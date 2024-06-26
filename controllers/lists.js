const jwt = require('jsonwebtoken')
const listsRouter = require('express').Router()
const List = require('../models/list')
const User = require('../models/user')
const middleware = require('../utils/middleware')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {

    return authorization.replace('Bearer ', '')


  }
  console.log('hit')
  return null
}

// listsRouter.get('/', async (request, response) => {
//   const lists = await List.find({})
//   response.status(201).json(lists)
// })

listsRouter.get('/', middleware.userExtractor, async (request, response) => {
  const user = request.user
  const lists = await List.find({ user: user.id })
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

listsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const user = request.user
  const listToDelete = await List.findById(request.params.id)

  if (!listToDelete) {
    response.status(404).json({ error: 'invalid id' })
  } else if (!(user.id === listToDelete.user.toJSON())) {
    response.status(401).json({ error: 'invalid user' })
  } else {
    await List.findByIdAndDelete(request.params.id)
    response.status(204).end()
  }
})

listsRouter.post('/', async (request, response, next) => {
  const body = request.body
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  console.log('user token:', decodedToken)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'Token invalid' })
  }

  const user = await User.findById(decodedToken.id)

  console.log('body', body)

  const list = new List({
    user: user.id,
    listName: body.listName,
    books: body.books
  })

  console.log('list', list)

  const savedList = await list.save()
  response.status(201).json(savedList)

})

listsRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const list = {
    listName: body.listName,
    books: body.books,
  }

  List.findByIdAndUpdate(request.params.id, list, { new: true })
    .then(updateList => {
      response.json(updateList)
    })
    .catch(error => next(error))
})


module.exports = listsRouter