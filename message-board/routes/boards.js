const express = require('express');
const router = express.Router();
const db = require('../models/index');
const { Op } = require('sequelize');

const pnum = 10;

function check(req, res) {
    if (req.session.login == null) {
        req.session.back = '/back';
        res.redirect('/users/login');
        return true;
    } else {
        return false;
    }
}

/* top page */
router.get(
      '/'
    , function(req, res, next) {
        res.redirect('/boards/0');
  }
);

router.get(
    '/:page'
  , (req, res, next) => {
    if (check(req, res)) {return;};
    const pg = req.params.page * 1;
    db.Board.findAll(
        {
            offset: pg * pnum
          , limit: pnum
          , order: [
              ['createdAt', 'DESC']
            ]
          , include: [{
                model: db.User
              , required: true
          }]
        }
    )
    .then(
        brds => {
            var data = {
                  title: 'Boards'
                , login: req.session.login
                , content: brds
                , page: pg
            }
            res.render('boards/index', data);
        }
    )
  }
);

// message form
router.post(
      '/add'
    , (req, res, next) => {
        if (check(req, res)) {return;};
        db.sequelize.sync()
        .then(
            () => {
                bd.Board.create({
                      userId: req.session.login.id
                    , message: req.body.msg
                })
            }
        )
        .then(
            brd => {
                res.redirect('/boards');
            }
        )
        .catch(
            (err) => {
                res.redirect('/boards');
            }
        )
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
