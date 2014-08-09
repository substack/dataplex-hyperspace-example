var hyperspace = require('hyperspace');
var fs = require('fs');
var html = fs.readFileSync(__dirname + '/server_full.html', 'utf8');

module.exports = function () {
    return hyperspace(html, { key: true }, function (row) {
        return {
            '*[data-name]': row.name,
            '*[data-link]': { href: '/server/' + row.name },
            '*[data-address]': row.address
        };
    });
};
