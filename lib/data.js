var dataplex = require('dataplex');
var through = require('through2');
var duplexer = require('duplexer2');
var live = require('level-live-stream');

module.exports = function (db) {
    var plex = dataplex();
    plex.add('/servers', function (opts) {
        return live(db, {
            start: [ 'server', null ],
            end: [ 'server', undefined ],
            old: !opts.live,
            tail: !!opts.live
        }).pipe(stringify());
    });
    plex.add('/server/:id/cpu', function (opts) {
        var stream = through.obj();
        var cpu = 50;
        var iv = setInterval(function () {
            cpu = Math.max(0, Math.min(100, cpu + Math.random() * 20 - 10));
            stream.push({ cpu: cpu, time: Date.now() });
        }, 250);
        stream.on('end', function () { clearInterval(iv) });
        return duplexer(stream, stream.pipe(stringify()));
    });
    return plex;
};

function stringify () {
    return through.obj(function (row, enc, next) {
        this.push(JSON.stringify(row) + '\n');
        next();
    });
}
