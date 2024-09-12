const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const bodyParser = require('body-parser');
const path = require('path');
const { error } = require('console');

const app = express();

app.use(session({
    store: new FileStore({
        path: './sessions',
        ttl: '3600',
        retries: 5
    }),
    saveUninitialized: false,
    resave: false,
    secret: 'deepganatra'
}));

app.use(bodyParser.urlencoded({extended: false}))

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

const users = [
    {name: 'Deep Ganatra', email: 'ganatradeep9@gmail.com', password: 'deep123'},
    {name: 'Vishwa Shah', email: 'shahvishwa212002@gmail.com', password: 'vishwa123'},
    {name: 'Harsh Adadhiyawala', email: 'harshadadhiyawala@gmail.com', password: 'harsh123'}
];

app.get('/', async(req, res)=>{
    if(req.session.name)
    {
        return res.render('dashboard', {name: req.session.name});
    }
    else
    {
        return res.redirect('/login');
    }
});

app.get('/login', (req, res)=>{
    return res.render('login', {error: null});
})
app.post("/login", (req, res)=>{
    const {email, password} = req.body;
    let flag = false;
    users.map(user=>{
        if(user.email === email && user.password === password)
        {
            req.session.name = user.name;
            flag = true
            return;
        }
    });

    if(flag)
        return res.redirect('/dashboard')
    else
        return res.render('login', {error: 'Invalid email or password'});
})
app.get('/dashboard', (req, res)=>{
    return res.render('dashboard', {name: req.session.name});
})
app.get('/logout', (req, res)=>{
    req.session.destroy();
    res.clearCookie('connect.sid');
    return res.redirect('/login');
})

app.listen(5000)