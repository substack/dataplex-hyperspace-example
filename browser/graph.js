var split = require('split');
var inherits = require('inherits');
var Writable = require('readable-stream/writable');
var through = require('through2');

module.exports = Graph;
inherits(Graph, Writable);

function Graph (opts) {
    var self = this;
    if (!(this instanceof Graph)) return new Graph(opts);
    Writable.call(this);
    
    this.element = createElement('svg', { width: 350, height: 100 });
    this.polyline = createElement('polyline', {
        stroke: 'purple',
        strokeWidth: 2,
        fill: 'transparent'
    });
    this.element.appendChild(this.polyline);
    
    this.splitter = split();
    this.splitter.pipe(through(function (buf, enc, next) {
        self.insert(JSON.parse(buf.toString('utf8')));
        next();
    }));
    this.points = [];
}

Graph.prototype.appendTo = function (target) {
    if (typeof target === 'string') target = document.querySelector(target);
    target.appendChild(this.element);
    return this;
};

Graph.prototype._write = function (buf, enc, next) {
    this.splitter.write(buf);
    next();
};

Graph.prototype.insert = function (row) {
    for (var i = 0; i < this.points.length; i++) {
        var p = this.points[i];
        if (row.time > p.time) break;
    }
    this.points.splice(i, 0, row);
};

Graph.prototype.animate = function () {
    this.polyline.setAttribute('points', this.points.map(function (pt) {
        var x = (Date.now() - pt.time) / 100;
        return x + ',' + pt.cpu;
    }).join(' '));
};

function createElement (name, opts) {
    var elem = document.createElementNS('http://www.w3.org/2000/svg', name);
    Object.keys(opts || {}).forEach(function (key) {
        elem.setAttribute(attrify(key), opts[key]);
    });
    return elem;
    
    function attrify (key) {
        return key.replace(/([a-z])([A-Z])/g, function (_, a, b) {
            return a + '-' + b.toLowerCase();
        });
    }
}
