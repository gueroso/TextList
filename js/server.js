var path = require('path');
var webpack = require('webpack');
var config = require('../webpack.config');

var express = require('express'),
    bodyParser = require('body-parser'),
    app = express();

var compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
}));

var server = app.listen(3000, function () {
    console.log('Listening on port %d', server.address().port);
});

app.get('/css/bootstrap.min.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'build/css/bootstrap.min.css'));
});

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build/index.html'));
});

app.post('/message ', function (req, res) {
    var resp = new twilio.TwimlResponse();

    if (req.body.Body.trim().toLowerCase() === 'complete' || 'done') {
        var fromNum = req.body.From;

        if (reminders.indexOf(fromNum) !== -1) {
            resp.message('You have already completed this task.');
        } else {
            resp.message('Thanks for taking the time to complete your task. I will stop reminding you.');
        }

        res.writeHead(200, {
            'Content-Type': 'text/xml'
        });
        res.end(resp.toString());
    }
});