var hyperspace = require('hyperspace');
var fs = require('fs');
var html = fs.readFileSync(__dirname + '/server.html', 'utf8');

module.exports = function () {
    return hyperspace(html, function (row) {
        return {
            '*[data-name]': row.value.name,
            '*[data-address]': row.value.address
        };
    });
};
