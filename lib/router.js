var fs = require('fs');
var path = require('path');
var routes = require('routes');
var hyperstream = require('hyperstream');

var bulk = require('bulk-require');
var render = bulk(path.join(__dirname, '../render'), [ '*.js' ]);

module.exports = function (plex) {
    var router = routes();
    router.addRoute('/', function (req, res, m) {
        res.setHeader('content-type', 'text/html');
        read('index.html').pipe(hyperstream({
            '#pages *[page=servers]': {
                style: 'display: block;',
                _html: plex.get('/servers').pipe(render.server())
            }
        })).pipe(res);
    });
    router.addRoute('/server/:id', function (req, res, m) {
        res.setHeader('content-type', 'text/html');
        read('index.html').pipe(hyperstream({
            '#pages *[page=server]': {
                style: 'display: block;',
                _html: plex.get('/server/' + m.params.id)
                    .pipe(render.server_full())
            }
        })).pipe(res);
    });
    return router;
};

function read (file) {
    return fs.createReadStream(path.join(__dirname, '../static', file));
}
