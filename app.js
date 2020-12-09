const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const cors = require('cors');
const exphbs  = require('express-handlebars');
const minify = require('express-minify');
const minifyHTML = require('express-minify-html');
const HbsHelpers = require('./helpers/Hbs');
const constant = require('./helpers/Constants');
const striptags = require('striptags');
const app = express();

/* Middleware */
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: HbsHelpers
}));
app.set('view engine', '.hbs');
app.use(minify());
app.use(minifyHTML({
    override: true,
    exception_url: false,
    htmlMinifier: {
        removeComments: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes: false,
        removeEmptyAttributes: true,
        minifyJS: true
    }
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use(cors());
app.use(session({
    key: 'user_sid',
    secret: 'cms12345',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: new Date(Date.now() + 2592000000), // 30 days
        maxAge: 2592000000,
        // httpOnly: false
    }
}));
app.use(async (req, res, next) => {

    if (req.cookies.user_sid && req.session.user == undefined) {
        res.clearCookie('user_sid');
    }

    // Set this cookie for collecting UPA data
    var vcookie = req.cookies.vuc;
    if (vcookie === undefined) {
        res.cookie('vuc', constant.Acak(25), { expires: new Date(Date.now() + (86400000 * 30)) });
    }
    next();
});

/* Routes */
const index = require('./routes/Index');

app.use('/', index);

module.exports = app;
