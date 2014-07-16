var dataplex = require('dataplex');
var through = require('through2');

module.exports = function (db) {
    var plex = dataplex();
    plex.add('/servers', function (opts) {
        return db.createReadStream({
            start: [ 'server', null ],
            end: [ 'server', undefined ]
        }).pipe(stringify());
    });
    return plex;
};

function stringify () {
    return through.obj(function (row, enc, next) {
        this.push(JSON.stringify(row) + '\n');
        next();
    });
}
