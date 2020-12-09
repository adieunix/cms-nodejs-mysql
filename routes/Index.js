const express = require('express');
const router = express.Router({ caseSensitive: true });
const Model = require('../models/Index');
const constant = require('../helpers/Constants');
const auth = require('../middlewares/auth');

router.get('/', auth, function (req, res) {
    let user = req.session.user;

    res.render('index', {

    });
});

router.get('/logout', function (req, res) {
    if (req.session.user && req.cookies.user_sid) {
        req.session.destroy();
        res.redirect('/login');
    } else {
        res.redirect('/login');
    }
});

router.get('/login', function (req, res) {
    res.render('login', {
        title: 'Login',
        login: true,
        alert: (req.query.a == 'success') ? true : (req.query.a == 'error') ? true : false,
        msg: (req.query.a == 'success') ? '<strong>Register berhasil</strong>, silahkan login kembali.' : '<strong>Terjadi kesalahan</strong>, mohon ulangi beberapa saat lagi.',
        type: (req.query.a == 'success') ? 'alert-success' : 'alert-danger',
        icon: (req.query.a == 'success') ? 'ni-check-circle' : 'ni-alert-circle',
    });
});

router.post('/login', function (req, res) {
    let params = {
        email: req.body.email,
        password: req.body.pwd
    };
    Model.loginUser(params, function (error, result) {
        if(error) {
            // res.json({
            //     status: false,
            //     data: error
            // });
            res.render('login', {
                title: 'Login',
                login: true,
                alert: true,
                msg: '<strong>Login gagal</strong>. Mohon ulangi kembali beberapa saat lagi',
                type: 'alert-danger',
                icon: 'ni-alert-circle',
            });
        } else {
            // res.json({
            //     status: true,
            //     data: result
            // });
            if(result.length > 0) {
                req.session.user = result;
                res.redirect('/');
            } else {
                res.render('login', {
                    title: 'Login',
                    login: true,
                    alert: true,
                    msg: 'Alamat email atau password tidak sesuai',
                    type: 'alert-danger',
                    icon: 'ni-alert-circle',
                });
            }
        }
    })
});

router.get('/register', function (req, res) {
    res.render('register', {
        title: 'Register',
        login: true,
        alert: false,
        msg: ''
    });
});

router.post('/register', function (req, res) {
    let params = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.pwd
    };
    Model.addUser(params, function (error, result) {
        if(error) {
            // res.json({
            //     status: false,
            //     data: error
            // });
            res.render('register', {
                title: 'Register',
                login: true,
                alert: true,
                msg: (error.errno == 1062) ? '<strong>Email sudah digunakan</strong>, mohon menggunakan alamat email yang lain' : '<strong>Register Gagal</strong>. Mohon ulangi register kembali sekali lagi.'
            });
        } else {
            if(result.affectedRows == 1) {
                res.redirect('/login?a=success');
            } else {
                res.render('register', {
                    title: 'Register',
                    login: true,
                    alert: true,
                    msg: '<strong>Register Gagal</strong>. Mohon ulangi register kembali sekali lagi.'
                });
            }

        }
    });
});

module.exports = router;
