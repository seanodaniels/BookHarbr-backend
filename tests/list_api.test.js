const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const List = require('../models/List')

beforeEach(async () => {
  await List.deleteMany({})
  const list1 = {
    listName: 'test list 1',
    bookKeys: [
      '/works/OL17363125W',
      '/works/OL17877492W'
    ]
  }
  const list2 = {
    listName: 'test list 2',
    bookKeys: [
      '/works/OL17363125W',
      '/works/OL17877492W',
      '/works/OL20086330W'
    ]
  }
  await api
    .post('/api/lists')
    .send(list1)
    .expect('Content-Type', /application\/json/)

  await api
    .post('/api/lists')
    .send(list2)
    .expect('Content-Type', /application\/json/)

})

test('lists are returned as json', async () => {
  await api
    .get('/api/lists')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

// test('there are two lists', async () => {
//   const response = await api.get('/api/lists')

afterAll(async () => {
  await mongoose.connection.close()
})