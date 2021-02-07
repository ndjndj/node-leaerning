const express = require('express');
const router = express.Router();
const db = require('../models/index');

router.get(
    '/'
  , (res, req, next) => {
    db.User.findAll().then(
      usrs => {
        var data = {
            title: 'Users/index'
          , content: usrs
        }
        res.render('users/index', data);
      }
    );
  }
);

module.exports = router;
