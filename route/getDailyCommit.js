const express = require('express');
const mysql = require('mysql');
const dbConfig = require('./databaseConfig');

let db = mysql.createPool({host: dbConfig.host, user: dbConfig.user, password: dbConfig.password, database: dbConfig.database});

module.exports = function () {
  let router = express.Router();

  router.post('/', (req, res) => {
    let finalData = {status: '0', unprocessed: [], unpassed: [], total: 0};
    db.query(`SELECT * FROM imgs_tab WHERE status=1`, (err, data) => {
      if (err) {
        console.err(err);
        res.status(500).send('database error').end();
      } else {
        finalData.unprocessed = data;
        db.query(`SELECT * FROM imgs_tab WHERE status=2`, (err, data) => {
          if (err) {
            console.err(err);
            res.status(500).send('database error').end();
          } else {
            finalData.unpassed = data;
            finalData.total = finalData.unpassed.length + finalData.unprocessed.length;
            res.send(finalData).end();
          }
        });
      }
    });
  });
  return router;
}
