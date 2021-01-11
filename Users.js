const Books = require('./Books.js')

module.exports = Users = [
    {
        id: 1,
        email: 'felipe@yahoo.com',
        password: '123456',
        books_acquired: [{
            id: 1,
            book: Books[0]
        },
        {
            id: 2,
            book: Books[1]
        }
        ]
    },
    {
        id: 2,
        email: 'joao@yahoo.com',
        password: 'asdfasdf',
        books_acquired: []
    },
    {
        id: 3,
        email: 'maria@yahoo.com',
        password: 'qwerqwer',
        books_acquired: [{
            id: 1,
            book: Books[0]
        },
        {
            id: 2,
            book: Books[1]
        }
        ]
    }
]
