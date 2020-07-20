const express = require('express');
const mysql = require('mysql');
const common = require('../libs/common');
const dbConfig = require('./databaseConfig');

let db = mysql.createPool({host: dbConfig.host, user: dbConfig.user, password: dbConfig.password, database: dbConfig.database});

module.exports = function () {
  let router = express.Router();

  router.post('/', (req, res) => {
    let act = req.body.act;
    let username = req.body.username;
    let password = common.md5(req.body.password + common.MD5_SUFFIX);

    if (act === 'login') {
      db.query(`SELECT ID,username,password from admin_tab`, (err, data) => {
        let ok = true;
        if (err) {
          res.status(500).send('database error').end();
        } else {
          for(let i=0;i<data.length;i++){
            let item = data[i];
            if (item.username === username && item.password === password) {
              req.session['manager_user_id'] = item.ID;
              res.send({'status': '0', 'info': '登录成功' ,"user_id":item.ID}).end();
              ok = false;
              break;
            }
          }
          if(ok){
            res.send({'status': '3', 'info': '账号或者密码错误'}).end();
          }
        }
      });
    }else if(act === 'logout'){
      delete req.session['manager_user_id'];
      res.send({"status":"0","info":"退出成功"}).end();
    }else if(act === 'getLoginUser'){
      let userId = req.session['manager_user_id'];

      if (typeof (userId) === 'undefined') {
        res.send({"status": "0", "user_id": "-1"}).end();
        return;
      }
      db.query(`SELECT ID,username FROM admin_tab WHERE ID=${userId}`,(err,data) => {
        if (err) {
          console.error(err);
          res.status(500).send('database error').end();
        } else {
          data[0]['status'] = '0';
          data[0]['info'] = 'success';
          data[0]['user_id'] = userId;
          res.send(data[0]).end();
        }
      });
    }
  });
  return router;
}
