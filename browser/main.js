var sock = require('shoe')('/sock');
var plex = require('dataplex')();
sock.pipe(plex).pipe(sock);

var bulk = require('bulk-require');
var files = bulk(__dirname + '/../elements', [ '*/browser.js' ]);
var scope = Object.keys(files).reduce(function (acc, key) {
    acc[key] = files[key].browser;
    return acc;
}, {});

var router = require('routes')();

router.addRoute('/', function (params) {
    var r = pages.server.browser(plex).list(params);
    r.appendTo('#pages *[page=server-list]');
});

router.addRoute('/server/:id', function (params) {
    var r = pages.server.browser(plex).detail(params);
    r.appendTo('#pages *[page=server-detail]');
});

var m = router.match(location.pathname + location.search);
if (m) m.fn(m.params);
