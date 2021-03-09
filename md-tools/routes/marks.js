const express = require('express');
const router = express.Router();
const db = require('../models/index');
const { Op } = require('sequelize');
const MarkdownIt = require('markdown-it');
const markdown = new MarkdownIt();

const pnum = 10;

// check login
function check(req, res) {
    if (req.session.login == null) {
        req.session.back = '/md';
        res.redirect('users/login');
        return true;
    } else {
        return false;
    }
}

//access top page
router.get(
  '/'
, (req, res, next) => {
    if (check(req, res)) {return;};
    db.Markdata.findAll({
          where: {userId: req.session.login.id}
        , limit: pnum
        , order: [['createdAt', 'DESC']]
    }).then(
        mds => {
            var data = {
                  title: 'Markdown Search'
                , login: req.session.login
                , message: '※最近の投稿データ'
                , form: {find: ''}
                , content: mds
            };
            res.render('md/index', data);
        }
    )
});

//search form
router.post(
    '/'
  , (req, res, next) => {
    if (check(req, res)) {return;};
    db.Markdata.findAll({
        where: {
              userId: req.session.login.id
            , content: {[Op.like]: `%${req.body.find}%`}
        }
      , limit: pnum
      , order: [['createdAt', 'DESC']]
    }).then(
      mds => {
          var data = {
                title: 'Markdown Search'
              , login: req.session.login
              , message: `※"${req.body.find}"で検索された最近の投稿データ`
              , form: req.body
              , content: mds
          };
          res.render('md/index', data);
      }
    )
});

router.get(
  '/add'
, (req, res, next) => {
  var data = {
      title: 'Users/Add'
    , form: new db.User()
    , err: null
  }
  res.render('users/add', data);
}
);



router.get(
  '/edit'
, (req, res, next) => {
  db.User.findByPk(req.query.id)
  .then(
      usr => {
        var data = {
            title: 'Users/Edit'
          , form: usr
        }
        res.render('users/edit', data);
      }
  );
}
);

router.post(
  '/edit'
, (req, res, next) => {
  db.User.findByPk(req.query.id)
  .then(
      usr => {
        usr.name = req.body.name;
        usr.pass = req.body.pass;
        usr.mail = req.body.mail;
        usr.age = req.body.age;
        usr.save().then(() => {res.redirect('/users')});
      }
  );
}
);

router.get(
  '/delete'
, (req, res, next) => {
  db.User.findByPk(req.query.id)
  .then(
      usr => {
        var data = {
            title: 'Users/Delete'
          , form: usr
        }
        res.render('users/delete', data);
      }
  );
}
);

router.post(
  '/delete'
, (req, res, next) => {
  db.User.findByPk(req.query.id)
  .then(
    usr => {
      usr.destroy().then(() => {res.redirect('/users')})
    }
  )
}
);


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
          console.log(req.session.login);
          console.log(usr);
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
