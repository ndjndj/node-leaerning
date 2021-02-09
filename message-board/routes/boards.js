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


module.exports = router;
