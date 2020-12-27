const express = require('express');
const router = express.Router();
const db = require('../models/index');

router.post('/', function(req, res) {
    const values = {
        content: req.body.replyContent,
        message_id: req.body.messageId,
        user_id: req.user.id
    };
    db.reply.create(values).then(function(results) {
        res.redirect('/messages/' + req.body.messageId)
    });
});

module.exports = router;