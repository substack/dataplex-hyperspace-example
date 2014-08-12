var bind = require('function-bind');
var attractor = require('attractor');
var loop = require('frame-loop');

var sock = require('shoe')('/sock');
var plex = require('dataplex')();
sock.pipe(plex).pipe(sock);
var router = require('routes')();

var scope = {
    server: require('../render/server/browser.js')
};
Object.keys(scope).forEach(function (key) {
    var f = scope[key];
    scope[key] = function () {
        var args = [].slice.call(arguments);
        args.unshift(plex);
        return f.apply(this, args);
    };
});

var tickers = [];
var engine = loop(function (dt) {
    for (var i = 0; i < tickers.length; i++) {
        tickers[i].tick(dt);
    }
});
engine.run();

var attr = attractor({
    'x-scope': [ require('attr-scope'), function (node) {
        if (node && typeof node.tick === 'function') {
            tickers.push(node);
            if (node.on) node.on('unload', unload);
        }
        function unload () {
            var ix = tickers.indexOf(node);
            if (ix >= 0) tickers.splice(ix, 1);
        }
    } ]
}, scope);
attr.scan(document);

var render = {
    server: require('../render/server')
};

router.addRoute('/', function (params) {
    var r = render.server.list(plex, { live: true });
    r.appendTo('#pages *[page=server-list]');
    attr.scan(document);
});

router.addRoute('/server/:id', function (params) {
    var r = render.server.detail(plex, { live: true });
    r.appendTo('#pages *[page=server-detail]');
    attr.scan(document);
});

var m = router.match(location.pathname + location.search);
if (m) m.fn(m.params);
