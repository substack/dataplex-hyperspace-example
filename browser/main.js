var sock = require('shoe')('/sock');
var plex = require('dataplex')();
sock.pipe(plex).pipe(sock);

var attractor = require('attractor');
var scope = {
    server: require('../render/server/browser.js')
};
var attr = attractor({
    'x-scope': require('attr-scope')
}, scope);

var render = {
    server: require('../render/server')
};

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
