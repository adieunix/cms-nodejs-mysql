const constant = require('../helpers/Constants');
const db = require('../dbconnection'); //reference of dbconnection.js
const md5 = require('md5');

module.exports = {

    addUser: function(user,callback) {
        return db.query("INSERT INTO cms_users (name,email,`password`) VALUES (?,?,?)", [user.name,user.email,md5(user.password)], callback);
    },

    getUserByEmail: function(email, callback) {
        return db.query("SELECT * FROM cms_users WHERE email = ?", [email], callback);
    },

    loginUser: function (user,callback) {
        return db.query("SELECT * FROM cms_users WHERE email = ? AND password = ?", [user.email,md5(user.password)], callback);
    }

};
