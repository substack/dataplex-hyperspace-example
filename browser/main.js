var through = require('through2');
var Graph = require('./graph.js');

var sock = require('shoe')('/sock');
var plex = require('dataplex')();
sock.pipe(plex).pipe(sock);

var graphs = [];

var servers = [].slice.call(document.querySelectorAll('.server'));
servers.forEach(function (server) {
    var name = server.querySelector('.name').textContent;
    var graph = Graph().appendTo(server.querySelector('.graph'));
    plex.open('/server/' + name + '/cpu').pipe(graph);
    graphs.push(graph);
});

(function frame () {
    graphs.forEach(function (g) { g.animate() });
    window.requestAnimationFrame(frame);
})();
