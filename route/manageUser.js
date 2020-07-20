const express = require('express');
const mysql = require('mysql');
const dbConfig = require('./databaseConfig');

let db = mysql.createPool({host: dbConfig.host, user: dbConfig.user, password: dbConfig.password, database: dbConfig.database});

module.exports = function () {
  let router = express.Router();

  router.post('/', (req, res) => {
    let act = req.body.act;

    if(act == 'getUser'){
      db.query(`SELECT ID,username,avatar,email,uStatus FROM user_tab`,(err,data) => {
        if(err){
          console.error(err);
          res.status(500).send('database error').end();
        }else{
          res.send(data).end();
        }
      });
    }else if (act == 'prohibit') {
      let ID = req.body.ID;
      db.query(`UPDATE user_tab SET uStatus=1 WHERE ID='${ID}'`, (err,data) => {
        if (err) {
          console.error(err);
          res.status(500).send('database error').end();
        }else{
          res.send({"status":"0","info":"操作成功"}).end();
        }
      });
    }else if(act == 'unprohibit'){
      let ID = req.body.ID;
      db.query(`UPDATE user_tab SET uStatus=0 WHERE ID='${ID}'`, (err,data) => {
        if (err) {
          console.error(err);
          res.status(500).send('database error').end();
        }else{
          res.send({"status":"0","info":"操作成功"}).end();
        }
      });
    }
  });
  return router;
}
