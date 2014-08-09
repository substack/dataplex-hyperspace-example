var render = {
    detail: require('./render/detail.js'),
    list: require('./render/list.js')
};
var Graph = require('./browser/graph.js');

module.exports = Server;
var loop = require('frame-loop');

function Server (plex) {
    if (!(this instanceof Server)) return new Server(plex);
    var self = this;
    
    this.plex = plex;
    this.loop = loop(function (dt) {
        for (var i = 0; i < self.graphs.length; i++) {
            self.graphs[i].tick(dt);
        }
    });
    this.graphs = [];
}

Server.prototype.list = function (params) {
    var self = this;
    var r = render.list();
    r.on('element', function (elem) {
        var name = elem.querySelector('*[data-name]').textContent;
        var graph = Graph().appendTo(elem.querySelector('.graph'));
        self.plex.open('/server/' + name + '/cpu').pipe(graph);
        self.graphs.push(graph);
    });
    this.loop.run();
    return this.plex.open('/servers', { live: true }).pipe(r);
};

Server.prototype.detail = function (params) {
    var r = render.detail();
    return this.plex.open('/server/' + params.id).pipe(r);
};
