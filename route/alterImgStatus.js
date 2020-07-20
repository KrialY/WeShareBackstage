const express = require('express');
const mysql = require('mysql');
const dbConfig = require('./databaseConfig');

let db = mysql.createPool({host: dbConfig.host, user: dbConfig.user, password: dbConfig.password, database: dbConfig.database});

//  0：审核通过 1：未审核 2：审核不通过
module.exports = function () {
  let router = express.Router();

  router.post('/', (req, res) => {
    let act = req.body.act;
    let imgId = req.body.imgId;

    if(act == 'pass'){
      db.query(`UPDATE imgs_tab SET status=0 WHERE ID='${imgId}'`, (err,data) => {
        if (err) {
          console.error(err);
          res.status(500).send('database error').end();
        }else{
          res.send({"status":"0","info":"照片通过审核"}).end();
        }
      });
    }else if (act == 'unpass') {
      db.query(`UPDATE imgs_tab SET status=2 WHERE ID='${imgId}'`, (err,data) => {
        if (err) {
          console.error(err);
          res.status(500).send('database error').end();
        }else{
          res.send({"status":"0","info":"照片不符合要求，审核不通过"}).end();
        }
      });
    }

  });
  return router;
}
