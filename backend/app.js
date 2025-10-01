const express = require('express')
const session = require('express-session')
require('dotenv').config()

const port = 8080

const app = express()

app.set('view engine', 'ejs')
app.set('views', './templates')

app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SECRET,
    cookie: {
        maxAge: 1000 * 60 * 30, //keep the user logged in for 30 mins
    }
}))
app.use('/static', express.static('public'))
app.use(express.urlencoded())

app.get('/admin', (req, res) => {
    if (req.session.isLoggedIn){
        res.sendFile(__dirname + '/')
    }else{
        res.redirect('/admin/login')
    }
})

app.get('/admin/login', (req, res) => {
    res.render('login', {error: '', username: '', focus: 'username', })
})

app.post('/admin/login', (req, res) => {
    const {username, password} = req.body
    if (username == process.env.A_USERNAME && password == process.env.A_PASSWORD){
        req.session.isLoggedIn = true
        res.redirect('/admin')
    }else{
        res.render('login', {error: 'Fel användarnamn eller lösenord. ', username: username, focus: 'password', })
    }
})

app.get('/admin/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/admin')
})

app.listen(port)