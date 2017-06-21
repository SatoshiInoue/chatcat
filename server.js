'use strict';
const express = require('express');
const app = express();
const chatCat = require('./app');
const passport = require('passport');

app.set('port', process.env.PORT || 3000);
// app.set('views', './views');
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(chatCat.session);
app.use(passport.initialize());
app.use(passport.session());
// app.use(require('morgan')('combined'));
app.use(require('morgan')('combined', {
  stream: {
    write: function(message) {
      // Write to logs
      // console.log("Write"+message);
      chatCat.logger.log('info', message);
    }
  }
}));

app.use('/', chatCat.router);

app.get('/dashboard', (req, res, next) => {
  res.send('<h1> This is the dashboard page! '+ req.hello + '</h1>');
});

chatCat.ioServer(app).listen(app.get('port'), function() {
  console.log('ChatCat Running on Port: ', 3000);
});
