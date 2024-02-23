const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const api = supertest(app)

const List = require('../models/list')
const User = require('../models/user')

let testToken = null

beforeEach(async () => {
  await List.deleteMany({})
  const listObjects = helper.initialLists.map(l => new List(l))
  const promiseArray = listObjects.map(l => l.save())
  await Promise.all(promiseArray)

  // Create new user
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('secret', 10)
  const user = {
    username: 'testuser',
    name: 'Testuser McTestface',
    passwordHash: passwordHash
  }
  const newUser = new User(user)
  await newUser.save()

  // Login testuser
  const username = 'testuser'
  const password = 'secret'

  const response = await api
    .post('/api/login')
    .send({ username, password })

  testToken = response.body.token

})

describe('\n=== GET Tests with sample initial notes ===', () => {

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

  test('Specific list is within the returned lists', async () => {
    const response = await api.get('/api/lists')
    const contents = response.body.map(l => l.listName)
    expect(contents).toContain('test list 1')
  })
})

describe('\n=== GET specific list ===', () => {

  test('GET specific list for viewing via valid id', async () => {
    const listsAtStart = await helper.listsInDb()
    const listToView = listsAtStart[0]

    const resultList = await api
      .get(`/api/lists/${listToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(resultList.body).toEqual(listToView)
  })

  test('GET specific list fails with 404 if the list id does not exist', async () => {
    const nopeId = await helper.nonExistingListId()
    await api.get(`/api/lists/${nopeId}`).expect(404)
  })

  test('GET specific list fails with 400 if id is invalid', async () => {
    const invalidId = 'not-a-valid-id'
    await api.get(`/api/lists/${invalidId}`).expect(400)
  })
})

describe('\n=== POST new list ===', () => {
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
      .set({ Authorization: `Bearer ${testToken}` })
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const listsAtEnd = await helper.listsInDb()
    expect(listsAtEnd).toHaveLength(helper.initialLists.length + 1)
    const contents = listsAtEnd.map(l => l.listName)
    expect(contents).toContain('[I exist only to succeed in the tests]')

  })

  test('POST missing "listName" fails with 400', async () => {
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

  test('POST missing a valid token fails with 400', async () => {
    const newList = {
      listName: '[I exist only to succeed in the tests]',
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

  test('POST containing an invalid token fails with 400', async () => {
    const newList = {
      listName: '[I exist only to succeed in the tests]',
      bookKeys: [
        '/works/OL17877492W'
      ]
    }
    await api
      .post('/api/lists')
      .send(newList)
      .set({ Authorization: `BEARER THIS_IS_A_BAD_TOKEN` })
      .expect(400)
    const response = await api.get('/api/lists')
    expect(response.body).toHaveLength(helper.initialLists.length)
  })
})

describe('\n=== DELETE a list ===', () => {
  test('DELETE specific list succeeds with a 204', async () => {
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
})

afterAll(async () => {
  await mongoose.connection.close()
})