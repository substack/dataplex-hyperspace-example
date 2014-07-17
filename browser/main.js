var through = require('through2');
var Graph = require('./graph.js');
var path = require('path');

var sock = require('shoe')('/sock');
var plex = require('dataplex')();
sock.pipe(plex).pipe(sock);

var bulk = require('bulk-require');
var render = bulk(__dirname + '/../render', [ '*.js' ]);

var graphs = [];

var r = render.server().appendTo('#servers');
r.on('element', function (elem) {
    var name = elem.querySelector('.name').textContent;
    var graph = Graph().appendTo(elem.querySelector('.graph'));
    plex.open('/server/' + name + '/cpu').pipe(graph);
    graphs.push(graph);
});

(function frame () {
    graphs.forEach(function (g) { g.animate() });
    window.requestAnimationFrame(frame);
})();
