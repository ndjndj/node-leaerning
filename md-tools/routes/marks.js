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

//add
router.get(
  '/add'
, (req, res, next) => {
    if (check(req, res)) {return;};
    res.render('md/add', {title: 'Markdown/Add'});
});

//add post
router.post(
    '/add'
  , (req, res, next) => {
    if (check(req, res)) {return;};
    db.sequelize.sync()
    .then(
        () => db.Markdata.create({
              userId: req.session.login.id
            , title: req.body.title
            , content: req.body.content
        })
        .then(
            model => {

                res.redirect('/md')
            }
        )
    );
});

//redirect with access to /mark
router.get(
    '/mark'
  , (req, res, next) => {
      res.redirect('/md');
      return;
 });

//show markdata oriented id
router.get(
    '/mark/:id'
  , (req, res, next) => {
    if (check(req, res)) {return;};
    db.Markdata.findOne({
        where: {
              id: req.params.id
            , userId: req.session.login.id
        },
    })
    .then(
        (model) => {
            makepage(req, res, model, true);
        }
    );
 });

 // update with markdata
 router.post(
    '/mark/:id'
  , (req, res, next) => {
    if (check(req, res)) {return;};
    db.Markdata.findByPk(req.params.id)
    .then(
        md => {
            md.content = req.body.source;
            md.save().then((model) => {makepage(req, res, model, false)});
        }
    )
});

// make show mark page
function makepage(req, res, model, flg) {
    var footer;
    if (flg) {
        var dcreday = new Date(model.createdAt);
        var creday = `${String(dcreday.getFullYear())}-${String(dcreday.getMonth() + 1)}-${String(dcreday.getDate())}`;
        var dupday = new Date(model.updatedAt);
        var upday = `${String(dupday.getFullYear())}-${String(dupday.getMonth() + 1)}-${String(dupday.getDate())}`;
        footer = `(created: ${creday}, updated: ${upday})`;
    } else {
        footer = `Updating date and time infomation...`;
    }
    var data = {
          title: 'Markdown'
        , id: req.params.id
        , head: model.title
        , footer: footer
        , content: markdown.render(model.content)
        , source: model.content
    };
    res.render('md/mark', data);
}

module.exports = router;
