require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path')
const app = express();
const exphbs = require('express-handlebars');

const Users = require('./Users.js')
const Books = require('./Books.js');
const { ESRCH } = require('constants');

app.use(express.json());

app.set('view engine', 'handlebars');
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));

app.use(express.static(path.join('public')));
app.use('/profile/:id', express.static(path.join('public')));
app.use(express.urlencoded({ extended: false }))

let currentUserId;

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/login', (req, res) => {
    res.render('login')
})

function Auth(req, res, next) {
    console.log(req.body.email)
    let user = Users.find(user => user.email == req.body.email)

    if (!req.body.email) {
        res.render('login', { msg: 'Email required' })
        return;
    }
    else if (!user) {
        res.render('login', { msg: 'Email not found' })
        return;
    }
    else {
        if (req.body.password == user.password) {
            next();
        }
        else {
            res.render('login', { msg: 'Password incorrect' })
            return;
        }
    }
}

app.post('/login', Auth, (req, res) => {
    let user = Users.find(user => user.email == req.body.email)
    currentUserId = user.id;
    res.redirect('profile/' + user.id);
})

app.get('/profile/:id', (req, res) => {
    let user = Users.find(user => user.id == req.params.id);
    currentUserId = user.id;
    console.log(user)
    res.render('profile', { user: user })
})

app.get('/logout', (req, res) => {
    currentUserId = 0;
    res.render('login');
})

app.get('/addbook', (req, res) => {
    res.render('addbook', { Books, userID: currentUserId });
})

app.post('/addbook/:id', (req, res) => {
    let user = Users.find(user => user.id == currentUserId);
    let book = Books.find(book => book.id == req.params.id);

    if (req.body.confirmation == 'Yes') {
        assignID(user);
        user.books_acquired.push({ id: newID, book });
        res.redirect('/profile/' + currentUserId);
    }
    else {
        res.redirect('/addbook');
    }
})

let newID;

async function assignID(user) {
    let allBooksID = user.books_acquired.map(item => item.id)
    console.log(allBooksID.length)
    if (allBooksID.length <= 5) {
        generateID();
        while (allBooksID.indexOf(newID) != -1 || newID == 0) {
            generateID();
        }
    }
    else {
        res.render('/addbook')
    }
}

async function generateID() {
    newID = Math.floor(Math.random() * 20);
    return newID;
}

app.post("/delbook/:id", (req, res) => {
    let user = Users.find(user => user.id == currentUserId);
    let book = user.books_acquired.find(item => item.id == req.params.id);

    console.log(book)

    if (req.body.confirmation == 'Yes') {
        user.books_acquired = user.books_acquired.filter(item => item.id !== book.id)
        res.redirect('/profile/' + currentUserId);
    }
    else {
        res.redirect('/profile/' + currentUserId);
    }
})

app.listen(3000, () => console.log('Express running'));