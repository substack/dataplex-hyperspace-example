var render = {
    detail: require('./render/detail.js'),
    list: require('./render/list.js')
};

exports.list = function (plex, params) {
    return plex.get('/servers').pipe(render.list());
};

exports.detail = function (plex, params) {
    return plex.get('/server/' + params.id).pipe(render.detail());
};
