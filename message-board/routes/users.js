var express = require('express');
const db = require('../../ex-gen-app/models');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get(
    '/login'
  , (req, res, next) => {
    var data = {
        title: 'Users/Login'
      , content: '名前とパスワードを入力してください'
    }
    res.render('users/login', data);
  }
);

router.post(
    '/login'
  , (req, res, next) => {
    db.User.findOne({
      where: {
          name: req.body.name
        , pass: req.body.pass
      }
    })
    .then(
      usr => {
        if (usr != null) {
          req.session.login = usr;
          let back = req.session.back;
          if (back == null) {
            back = '/';
          }
          res.redirect(back);
        } else {
          var data  = {
              title: 'Users/Login'
            , content: '名前かパスワードに問題があります。再度入力してください'
          }
          res.render('users/login', data);
        }
      }
    )
  }
);

module.exports = router;
