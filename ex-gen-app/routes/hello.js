const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3');

// データベースオブジェクトの取得
const db = new sqlite3.Database('mydb.sqlite3');

router.get(
      '/'
    , (req, res, next) => {
        // データベースのシリアライズ
        db.serialize(
            () => {
                var rows = '';
                db.each(
                      'select * from mydata'
                    , (err, row) => {
                        if(!err) {
                            rows += `<tr><th>${String(row.id)}</th><td>${row.name}</td></tr>`
                        }
                    }
                    , (err, count) => {
                        if(!err) {
                            var data = {
                                  title: 'Hello!'
                                , content: rows
                            };
                            res.render('hello', data);
                        }
                    }
                );
            }
        )
    }
);

module.exports = router;
