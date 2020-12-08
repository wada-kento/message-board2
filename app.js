var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('trust praxy', 1);
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

var methodOverride = require('method-override');
app.use(methodOverride(function(req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
    }
}));

const db = require('./models/index');
passport.serializeUser((user, done) => {
    done(null, user.id)
});

passport.deserializeUser((id, done) => {
    db.user.findByPk(id)
        .then(function(user) {
            done(null, user)
        })
        .catch(function(error) {
            done(error, null)
        });
});
// passport.authenticateで使用する認証部分
passport.use(new LocalStrategy(
    function(name, password, done) {
        db.user.findOne({
                where: {
                    name: name
                }
            })
            .then(function(user) {
                // 名前チェックして、存在しなかったらストップ
                if (!user) {
                    return done(null, false, { message: '入力された名前のユーザーは存在しません。' });
                }
                // パスワードチェックして、一致しなかったらストップ
                bcrypt.compare(password, user.password, function(error, result) {
                    if (!result) {
                        return done(null, false, { message: 'パスワードが一致しません。' });
                    }
                });
                // 上2つを潜り抜けたらログインできる
                return done(null, user);
            })
            .catch(function(err) {
                if (err) { return done(err); }
            });
    }
));

app.get('/', function(req, res) {
    res.redirect('/messages');
});

//メッセージ一覧
app.get('/messages', function(req, res) {
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

app.get('/messages/new', function(req, res) {
    res.render('new.ejs');
});

//メッセージ作成
app.post('/messages', function(req, res) {
    const values = {
        content: req.body.content,
        user_id: req.user.id
    };
    db.message.create(values).then(function(results) {
        res.redirect('/messages')
    });
});

//個別ページ
app.get('/messages/:id', function(req, res) {
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

//メッセージ編集
app.get('/messages/:id/edit', function(req, res) {
    if (!req.user) {
        return res.redirect('/signin');
    }
    db.message.findByPk(req.params.id).then(function(results) {
        res.render('edit.ejs', { message: results });
    });

});

app.put('/messages/:id', function(req, res) {
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

app.delete('/messages/:id', function(req, res) {
    const options = {
        where: {
            id: req.params.id
        }
    };
    db.message.destroy(options).then(function(results) {
        res.redirect('/messages')
    });
});

app.post('/replies', function(req, res) {
    const values = {
        content: req.body.replyContent,
        message_id: req.body.messageId,
        user_id: req.user.id
    };
    db.reply.create(values).then(function(results) {
        res.redirect('/messages/' + req.body.messageId)
    });
});

app.get('/signup', function(req, res) {
    res.render('users/signup');
});

//ユーザー作成
app.post('/signup', function(req, res) {
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

require('dotenv').config();
app.get('/signin', function(req, res) {
    res.render('users/signin');
});

app.post('/signin', passport.authenticate('local', {
    successRedirect: '/messages',
    failureRedirect: '/signin'
}));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;