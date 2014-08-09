var http = require('http');
var fs = require('fs');
var path = require('path');
var ecstatic = require('ecstatic')(__dirname + '/static');

var level = require('level');
var db = level('/tmp/test.db', {
    keyEncoding: require('bytewise'),
    valueEncoding: 'json'
});

//db.batch(require('./data.json'));
var data = require('./data.json');
var iv = setInterval(function () {
    if (data.length === 0) return clearInterval(iv);
    var d = data.shift();
    db.put(d.key, d.value, function () {});
}, 2000);

var dataplex = require('./lib/data.js');
var router = require('./lib/router.js')(dataplex(db));

var server = http.createServer(function (req, res) {
    var m = router.match(req.url);
    if (m) m.fn(req, res, m)
    else ecstatic(req, res);
});
server.listen(5000);

var sock = require('shoe')(function (stream) {
    stream.pipe(dataplex(db)).pipe(stream);
});
sock.install(server, '/sock');
