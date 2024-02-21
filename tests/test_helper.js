const List = require('../models/list')
const User = require('../models/user')

const initialLists = [
  {
    listName: 'test list 1',
    bookKeys: [
      '/works/OL17363125W',
      '/works/OL17877492W'
    ]
  },
  {
    listName: 'test list 2',
    bookKeys: [
      '/works/OL17363125W',
      '/works/OL17877492W',
      '/works/OL20086330W'
    ]
  }
]

const nonExistingListId = async () => {
  const list = new List(
    {
      listName: 'I only exist to provide a unique ID :(',
      bookKeys: [
        '/works/OL17363125W',
        '/works/OL17877492W'
      ]
    }
  )
  await list.save()
  await list.deleteOne()

  return list._id.toString()
}

const listsInDb = async () => {
  const lists = await List.find({})
  return lists.map(l => l.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialLists,
  nonExistingListId,
  listsInDb,
  usersInDb,
}