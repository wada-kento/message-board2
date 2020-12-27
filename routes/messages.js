const express = require('express');
const router = express.Router();
const db = require('../models/index');

//メッセージ一覧
router.get('/messages', function(req, res) {
    if (!req.user) {
        return res.redirect('/signin');
    }
    const options = {
        include: [{
            model: db.user
        }]
    };
    db.message.findAll(options).then(function(results) {
        res.render('index.ejs', { messages: results, user: req.user });
    });
});


router.get('/messages/new', function(req, res) {
    res.render('new.ejs');
});


//個別ページ
router.get('/messages/:id', function(req, res) {
    if (!req.user) {
        return res.redirect('/signin');
    }
    const options = {
        include: [{
            model: db.reply,
            include: [{
                model: db.user
            }]
        }]
    };
    db.message.findByPk(req.params.id, options).then(function(results) {
        res.render('show.ejs', {
            message: results
        })
    });

});

//メッセージ作成
router.post('/messages', function(req, res) {
    const values = {
        content: req.body.content,
        user_id: req.user.id
    };
    db.message.create(values).then(function(results) {
        res.redirect('/messages')
    });
});

//メッセージ編集
router.get('/messages/:id/edit', function(req, res) {
    if (!req.user) {
        return res.redirect('/signin');
    }
    db.message.findByPk(req.params.id).then(function(results) {
        res.render('edit.ejs', { message: results });
    });

});

router.put('/messages/:id', function(req, res) {
    const values = {
        content: req.body.content
    };
    const options = {
        where: {
            id: req.params.id
        }
    };
    db.message.update(values, options).then(function(results) {
        res.redirect('/messages');
    });
});


router.delete('/messages/:id', function(req, res) {
    const options = {
        where: {
            id: req.params.id
        }
    };
    db.message.destroy(options).then(function(results) {
        res.redirect('/messages')
    });
});

module.exports = router;