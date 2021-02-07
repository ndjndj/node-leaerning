const express = require('express');
const router = express.Router();
const db = require('../models/index');
const { Op } = require('sequelize');

router.get(
    '/'
  , (req, res, next) => {
    const name = req.query.name;
    db.User.findAll(
      {
        where: {
          name: {[Op.like]: `%${name}%`}
        }
      }
    ).then(
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
