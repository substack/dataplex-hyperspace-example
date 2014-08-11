var hyperspace = require('hyperspace');
var fs = require('fs');
var html = {
    detail: fs.readFileSync(__dirname + '/detail.html', 'utf8'),
    summary: fs.readFileSync(__dirname + '/summary.html', 'utf8')
};

exports.detail = function (plex, opts) {
    var render = hyperspace(html.detail, { key: true }, function (row) {
        return {
            '*[data-name]': row.name,
            '*[data-link]': { href: '/server/' + row.name },
            '*[data-address]': row.address
        };
    });
    return plex.get('/servers').pipe(render);
};

exports.list = function (plex, opts) {
    var render = hyperspace(html.summary, { key: 'key' }, function (row) {
        return {
            '*[data-name]': row.value.name,
            '*[data-link]': { href: '/server/' + row.value.name },
            '*[data-address]': row.value.address
        };
    });
    return plex.get('/server/' + params.id, opts).pipe(render);
};
