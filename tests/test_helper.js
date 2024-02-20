const List = require('../models/List')

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

const nonExistingId = async () => {
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
  await note.deleteOne()

  return note._id.toString()
}

const listsInDb = async () => {
  const lists = await List.find({})
  return lists.map(l => l.toJSON())
}

module.exports = {
  initialLists,
  nonExistingId,
  listsInDb
}