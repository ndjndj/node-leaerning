var express = require('express');
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

module.exports = router;
