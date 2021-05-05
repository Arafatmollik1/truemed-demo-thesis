var express = require('express');
var app = express();

app.use(express.static(__dirname + '/'));
console.log('App is running on 3500');
app.listen(process.env.PORT || 3500);