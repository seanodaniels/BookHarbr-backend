const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const api = supertest(app)

const List = require('../models/List')

beforeEach(async () => {
  await List.deleteMany({})

  let listObject = new List(helper.initialLists[0])
  await listObject.save()

  listObject = new List(helper.initialLists[0])
  await listObject.save()

})

test('GET lists returns all lists', async () => {
  const response = await api.get('/api/lists')
  expect(response.body).toHaveLength(helper.initialLists.length)
})

test('GET lists are returned as json', async () => {
  await api
    .get('/api/lists')
    .expect(201)
    .expect('Content-Type', /application\/json/)
})

test('GET returns two lists', async () => {
  const response = await api.get('/api/lists')
  expect(response.body).toHaveLength(2)
})

test('POST successfully adds new list', async () => {
  const newList = {
    listName: '[I exist only to succeed in the tests]',
    bookKeys: [
      '/works/OL17877492W'
    ]
  }

  await api
    .post('/api/lists')
    .send(newList)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const listsAtEnd = await helper.listsInDb()
  expect(listsAtEnd).toHaveLength(helper.initialLists.length + 1)
  const contents = listsAtEnd.map(l => l.listName)
  expect(contents).toContain('[I exist only to succeed in the tests]')

})

test('POST of invalid info does not add content to database', async () => {
  const newList = {
    bookKeys: [
      '/works/OL17877492W'
    ]
  }

  await api
    .post('/api/lists')
    .send(newList)
    .expect(400)

  const response = await api.get('/api/lists')
  expect(response.body).toHaveLength(helper.initialLists.length)
})


test('GET specific list for viewing', async () => {
  const listsAtStart = await helper.listsInDb()
  const listToView = listsAtStart[0]

  const resultList = await api
    .get(`/api/lists/${listToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(resultList.body).toEqual(listToView)
})

test('DELETE specific note', async () => {
  const listsAtStart = await helper.listsInDb()
  const listToDelete = listsAtStart[0]

  await api
    .delete(`/api/lists/${listToDelete.id}`)
    .expect(204)

  const listsAtEnd = await helper.listsInDb()

  expect(listsAtEnd).toHaveLength(helper.initialLists.length - 1)

  const ids = listsAtEnd.map(l => l.id)

  expect(ids).not.toContain(listToDelete.id)

})

afterAll(async () => {
  await mongoose.connection.close()
})