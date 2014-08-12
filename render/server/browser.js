var Graph = require('./browser/graph.js');
module.exports = Server;

function Server (plex, elem) {
    if (!(this instanceof Server)) return new Server(plex, elem);
    var self = this;
    
    var name = elem.querySelector('*[data-name]').textContent;
    this.graph = Graph().appendTo(elem.querySelector('.graph'));
    plex.open('/server/' + name + '/cpu').pipe(this.graph);
}

Server.prototype.tick = function (dt) {
    this.graph.tick(dt);
};
