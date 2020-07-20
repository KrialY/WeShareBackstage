const express = require('express');
const mysql = require('mysql');
const dbConfig = require('./databaseConfig');

let db = mysql.createPool({host: dbConfig.host, user: dbConfig.user, password: dbConfig.password, database: dbConfig.database});

module.exports = function () {
  let router = express.Router();

  router.post('/', (req, res) => {
    let act = req.body.act;

    if(act == 'getBarrage'){
      db.query(`SELECT * FROM barrage_tab`,(err,data) => {
        if(err){
          console.error(err);
          res.status(500).send('database error').end();
        }else{
          res.send(data).end();
        }
      });
    }else if (act == 'deleteBarrage') {
      let ID = req.body.ID;
      db.query(`DELETE FROM barrage_tab WHERE ID=${ID}`, (err, data) => {
        if (err) {
          res.status(500).send('database error').end();
        } else {
          res.send({'status': '0', 'info': '删除成功'}).end();
        }
      });
    }
  });
  return router;
}
