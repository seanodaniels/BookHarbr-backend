const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const User = require('../models/user')

test('placeholder', () => {
  expect(true).toEqual(true)
})

describe('\n=== POST single user ===', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('secret', 10)
    const user = {
      username: 'testuser',
      name: 'Testuser McTestface',
      passwordHash: passwordHash
    }
    const newUser = new User(user)
    // const newUser = new User({ username: 'root', passwordHash })
    await newUser.save()
  })

  test('There is only one user in the db', async () => {
    const response = await api.get('/api/users')
    expect(response.body.length).toEqual(1)
  })

  test('Creation of new user succeeds.', async () => {
    const usersAtBeginning = await helper.usersInDb()
    const user = {
      username: 'newuser',
      name: 'Newuser Successface',
      password: 'secret'
    }
    await api
      .post('/api/users/')
      .send(user)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toEqual(usersAtBeginning.length + 1)
    const usernamesAtEnd = usersAtEnd.map(u => u.username)
    // expect(usernamesAtEnd).toContain(user.username)
  })

  test('Creation of existing username fails with 400.', async () => {
    const user = {
      username: 'testuser',
      name: 'Testuser McDoppleganger',
      password: 'secret'
    }
    await api
      .post('/api/users')
      .send(user)
      .expect(400)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})