var hyperspace = require('hyperspace');
var fs = require('fs');
var html = {
    detail: fs.readFileSync(__dirname + '/html/detail.html', 'utf8'),
    summary: fs.readFileSync(__dirname + '/html/summary.html', 'utf8')
};

exports.list = function (plex, opts) {
    var render = hyperspace(html.summary, { key: 'key' }, function (row) {
        return {
            '*[data-name]': row.value.name,
            '*[data-link]': { href: '/server/' + row.value.name },
            '*[data-address]': row.value.address
        };
    });
    return plex.open('/servers', opts).pipe(render);
};

exports.detail = function (plex, opts) {
    var render = hyperspace(html.detail, function (row) {
        return {
            '*[data-name]': row.name,
            '*[data-link]': { href: '/server/' + row.name },
            '*[data-address]': row.address
        };
    });
    return plex.open('/server/' + opts.id, opts).pipe(render);
};
