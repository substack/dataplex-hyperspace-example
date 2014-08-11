var fs = require('fs');
var path = require('path');
var routes = require('routes');
var hyperstream = require('hyperstream');

var bulk = require('bulk-require');
var pages = bulk(path.join(__dirname, '../pages'), [ '*/server.js' ]);

module.exports = function (plex) {
    var router = routes();
    router.addRoute('/', function (req, res, m) {
        res.setHeader('content-type', 'text/html');
        read('index.html').pipe(hyperstream({
            '#pages *[page=server-list]': {
                style: 'display: block;',
                _html: pages.server.list(plex, m.params)
            }
        })).pipe(res);
    });
    router.addRoute('/server/:id', function (req, res, m) {
        res.setHeader('content-type', 'text/html');
        read('index.html').pipe(hyperstream({
            '#pages *[page=server-detail]': {
                style: 'display: block;',
                _html: pages.server.detail(plex, m.params)
            }
        })).pipe(res);
    });
    return router;
};

function read (file) {
    return fs.createReadStream(path.join(__dirname, '../static', file));
}
