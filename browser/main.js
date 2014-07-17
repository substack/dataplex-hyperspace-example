var through = require('through2');
var Graph = require('./graph.js');

var sock = require('shoe')('/sock');
var plex = require('dataplex')();
sock.pipe(plex).pipe(sock);

var servers = [].slice.call(document.querySelectorAll('.server'));
servers.forEach(function (server) {
    var name = server.querySelector('.name').textContent;
    var graph = Graph().appendTo('.graph');
    plex.open('/server/' + name + '/cpu').pipe(graph);
});
