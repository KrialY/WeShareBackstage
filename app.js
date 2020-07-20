var express = require('express');
var fs = require('fs');
var path = require('path');
const bodyParser=require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const dbConfig = require('./route/databaseConfig');

let keys = [];
for (let i = 0; i < 10000; i++) {
  keys.push('signed_'+Math.random());
}
let app = express();

app.use(cookieParser());
app.use(cookieSession({
    name: 'manager_user_id',
    keys: keys,
    maxAge: 60 * 60 * 1000
}));
app.use(bodyParser.urlencoded());
app.use('/api/login',require('./route/login')());
app.use('/api/getTypes',require('./route/types')());
app.use('/api/getHistoryImg',require('./route/getHistoryImg')());
app.use('/api/manageBarrage',require('./route/manageBarrage')());
app.use('/api/manageUser',require('./route/manageUser')());
app.use('/api/getDailyCommit',require('./route/getDailyCommit')());
app.use('/api/getUserLoadedImg',require('./route/LoadedImg')());
app.use('/api/alterImgStatus',require('./route/alterImgStatus')());

app.use(express.static(path.resolve(__dirname, './dist')));

app.listen(8080, function () {
  console.log('success listen...8080');
});