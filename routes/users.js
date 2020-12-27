const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../models/index');
var passport = require('passport');

router.get('/signup', function(req, res) {
    res.render('users/signup');
});

//ユーザー作成
router.post('/signup', function(req, res) {
    bcrypt.hash(req.body.password, 10, function(error, hashedPassword) {
        const values = {
            name: req.body.name,
            password: hashedPassword
        };
        db.user.create(values).then(function(results) {
            res.redirect('/messages');
        });
    })
});

router.get('/signin', function(req, res) {
    res.render('users/signin');
});

router.post('/signin', passport.authenticate('local', {
    successRedirect: '/messages',
    failureRedirect: '/signin'
}));

module.exports = router;